console.log("Movies started");

let moviesData = [];
let currentPage = 1;
let itemsPerPage = 4;

// API URLs
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIE_URL = `${API_BASE}/admin/movie`;
const MOVIES_URL = `${API_BASE}/admin/movies`;
const POST_MOVIES_URL = `${API_BASE}/admin/movie`;
const CATEGORIES_URL = `${API_BASE}/admin/categories`;
const ACTORS_URL = `${API_BASE}/admin/actors`;

// Global variables
let currentMovieId = null;

// Bootstrap modal instances
const createModalEl = document.getElementById("createMoviesModal");
const updateModalEl = document.getElementById("updateMoviesModal");
const removeModalEl = document.getElementById("removeMoviesModal");
const createModalInstance = new bootstrap.Modal(createModalEl);
const updateModalInstance = new bootstrap.Modal(updateModalEl);
const removeModalInstance = new bootstrap.Modal(removeModalEl);

// Initialize - Load movies on page load
loadMovies();
loadCategories();
loadActors();

// Auth
setTimeout(auth,3000)

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        localStorage.removeItem(`token`)
        localStorage.removeItem(`role`)
        window.location.href = "/Filmalisa/admin/pages/login.html";
    }
}

// Setup event listeners
const createBtn = document.querySelector('.createBtnOnModal');
if (createBtn) {
    createBtn.addEventListener("click", handleCreateMovies);
}

const updateBtn = document.querySelector('.updateBtnOnModal');
if (updateBtn) {
    updateBtn.addEventListener("click", handleUpdateMovies);
}

const deleteBtn = document.querySelector('.deleteBtnOnModal');
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteMovie);
}

// Clear create form when modal is closed
createModalEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById('movieForm').reset();
});

// Load and display movies
function loadMovies() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(MOVIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        console.log("Movies loaded:", resp);
        moviesData = resp['data'];
        displayPage(1)
    })
    .catch(error => {
        console.error("Error loading movies:", error);
        alert("Error loading movies");
    });
}

// Load and display categories
function loadCategories() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        console.log("Categories loaded:", resp);
        let result = "";
        resp.data.forEach(category => {
            result += `<option value="${category.id}">${category.name}</option>`;
        });
        document.querySelector("#createMoviesModal #category").innerHTML = result;
        document.querySelector("#updateMoviesModal #category2").innerHTML = result;
    })
    .catch(error => {
        console.error("Error loading categories:", error);
    });
}

// Load and display actors
function loadActors() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(ACTORS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        console.log("Actors loaded:", resp);
        let result = "";
        resp.data.forEach(actor => {
            result += `<option value="${actor.id}">${actor.name}</option>`;
        });
        document.querySelector("#createMoviesModal .actor").innerHTML = result;
        document.querySelector("#updateMoviesModal .actor").innerHTML = result;
    })
    .catch(error => {
        console.error("Error loading actors:", error);
    });
}



function displayPage(page){
    currentPage = page;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageData = moviesData.slice(startIndex, endIndex);
    setUserList(pageData, page);
    setPagination();
}

function setUserList(data, page){
    let result = "";
    let startIndex = (page - 1) * itemsPerPage;

    data.forEach((movie, index) => {
        let order = startIndex + index + 1;
        let row = `
          <tr>
                <td class="movie-id" style="display: none">${movie.id}</td>
                <td class="order-id">${order}</td>
                <td class="movie-image"><img src="${movie.cover_url}" alt="${movie.title}" class="actor-image"></td>
                <td>${movie.title}</td>
                <td class="movie-overview crop">${movie.overview}</td>
                <td>${movie.category?.name || 'N/A'}</td>
                <td>${movie.imdb}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal(${movie.id})">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${movie.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
          </tr>
        `;
        result += row;
    });
    document.querySelector(".page-table tbody").innerHTML = result;
}

// function setPagination(){
//     let totalPages = Math.ceil(moviesData.length / itemsPerPage);

//     if(totalPages > 0) {
//         let result = `<ul class="pagination">`;

//         // Page numbers
//         for (let i = 1; i <= totalPages; i++) {
//             result += `<li class="page-item ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">
//                 <a class="page-link"">${i}</a>
//             </li>`;
//         }

//         result += `</ul>`;
//         document.querySelector(".pagination").innerHTML = result;
//     }
// }
function setPagination() {
    const totalPages = Math.ceil(moviesData.length / itemsPerPage);
    const maxVisiblePages = 3; // eyni anda görünən səhifə sayı
    let result = `<ul class="pagination">`;

    // Previous düyməsi
    result += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('prev')">Previous</a>
        </li>`;

    // Başlanğıc və son səhifə nömrələrini hesablayaq
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Əgər səhifələr azdırsa, aralığı düzəldirik
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Görünən səhifə nömrələri
    for (let i = startPage; i <= endPage; i++) {
        result += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="displayPage(${i})">${i}</a>
            </li>`;
    }

    // Next düyməsi
    result += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('next')">Next</a>
        </li>`;

    result += `</ul>`;
    document.querySelector(".pagination").innerHTML = result;
}

function changePage(direction) {
    const totalPages = Math.ceil(moviesData.length / itemsPerPage);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    displayPage(currentPage);
}



// Deprecated
// Display movies in table
function displayMovies(movies) {
    const tbody = document.querySelector("table tbody");

    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    tbody.innerHTML = "";

    if (!movies || movies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No movies found</td></tr>';
        return;
    }

    movies.forEach(movie => {
        const row = `
            <tr>
                <td class="movie-id">${movie.id}</td>
                <td class="movie-image"><img src="${movie.cover_url}" alt="${movie.title}" class="actor-image"></td>
                <td>${movie.title}</td>
                <td class="movie-overview crop">${movie.overview}</td>
                <td>${movie.category?.name || 'N/A'}</td>
                <td>${movie.imdb}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal(${movie.id})">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${movie.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Handle create movies
function handleCreateMovies() {
    const title = document.querySelector("#createMoviesModal .title").value;
    if (!title) {
        alert("Please enter a title");
        return;
    }

    const overview = document.querySelector("#createMoviesModal .overview").value;
    if (!overview) {
        alert("Please enter an overview");
        return;
    }

    const coverUrl = document.querySelector("#createMoviesModal .coverUrl").value;
    if (!coverUrl) {
        alert("Please enter a cover URL");
        return;
    }

    const fragmanUrl = document.querySelector("#createMoviesModal .fragmanUrl").value;
    if (!fragmanUrl) {
        alert("Please enter a trailer URL");
        return;
    }

    const watchUrl = document.querySelector("#createMoviesModal .watchUrl").value;
    if (!watchUrl) {
        alert("Please enter a watch URL");
        return;
    }

    const imdb = document.querySelector("#createMoviesModal .imdbUrl").value;
    if (!imdb) {
        alert("Please enter an IMDB rating");
        return;
    }

    const runtime = document.querySelector("#createMoviesModal .runtime").value;
    if (!runtime) {
        alert("Please enter runtime");
        return;
    }

    const category = document.querySelector("#createMoviesModal .category").value;
    if (!category) {
        alert("Please select a category");
        return;
    }

    const actorInput = document.querySelector("#createMoviesModal .actor");
    const actors = Array.from(actorInput.selectedOptions).map(option => parseInt(option.value));
    if (actors.length === 0) {
        alert("Please select at least one actor");
        return;
    }

    const adult = document.querySelector("#createMoviesModal .adult").checked;

    const body = {
        title: title,
        overview: overview,
        cover_url: coverUrl,
        fragman: fragmanUrl,
        watch_url: watchUrl,
        imdb: imdb,
        run_time_min: parseInt(runtime),
        category: parseInt(category),
        actors: actors,
        adult: adult
    };

    console.log("Creating movie:", body);
    const token = localStorage.getItem("token");

    fetch(POST_MOVIES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Movie created:", resp);
        loadMovies();
        createModalInstance.hide();
        document.getElementById('movieForm').reset();
    })
    .catch(error => {
        console.error("Error creating movie:", error);
        alert("Error creating movie");
    });
}

// Open update modal
function openUpdateModal(movieId) {
    currentMovieId = movieId;
    console.log("Opening update modal for movie ID:", currentMovieId);

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    // Load single movie
    fetch(`${API_BASE}/movies/${movieId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        console.log("Movie loaded:", resp);
        const movie = resp.data;

        // Populate form fields
        document.querySelector("#updateMoviesModal .title").value = movie.title || '';
        document.querySelector("#updateMoviesModal .overview").value = movie.overview || '';
        document.querySelector("#updateMoviesModal .coverUrl").value = movie.cover_url || '';
        document.querySelector("#updateMoviesModal .fragmanUrl").value = movie.fragman || '';
        document.querySelector("#updateMoviesModal .watchUrl").value = movie.watch_url || '';
        document.querySelector("#updateMoviesModal .imdbUrl").value = movie.imdb || '';
        document.querySelector("#updateMoviesModal .runtime").value = movie.run_time_min || '';
        document.querySelector("#updateMoviesModal #checkbox2").checked = movie.adult || false;

        // Set category
        if (movie.category && movie.category.id) {
            document.querySelector("#updateMoviesModal .category").value = movie.category.id;
        }

        // Set actors
        if (movie.actors && movie.actors.length > 0) {
            const actorSelect = document.querySelector("#updateMoviesModal .actor");
            Array.from(actorSelect.options).forEach(option => {
                option.selected = movie.actors.some(actor => actor.id == option.value);
            });
        }

        // Show modal
        updateModalInstance.show();
    })
    .catch(error => {
        console.error("Error loading movie:", error);
        alert("Error loading movie");
    });
}

// Open delete modal
function openDeleteModal(movieId) {
    currentMovieId = movieId;
    const deleteModalEl = document.getElementById('removeMoviesModal');
    const deleteModalInstance = new bootstrap.Modal(deleteModalEl);
    deleteModalInstance.show();
}

// Handle delete movie
function handleDeleteMovie() {
    if (!currentMovieId) {
        alert("No movie selected");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    console.log("Deleting movie ID:", currentMovieId);

    fetch(`${MOVIE_URL}/${currentMovieId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        console.log("Movie deleted:", resp);
        currentMovieId = null;
        loadMovies();

        // Close modal
        const deleteModalEl = document.getElementById('removeMoviesModal');
        const deleteModalInstance = bootstrap.Modal.getInstance(deleteModalEl);
        if (deleteModalInstance) {
            deleteModalInstance.hide();
        }
    })
    .catch(error => {
        console.error("Error deleting movie:", error);
        alert("Error deleting movie");
    });
}

// Handle update movies
function handleUpdateMovies() {
    const title = document.querySelector("#updateMoviesModal .title").value;
    if (!title) {
        alert("Please enter a title");
        return;
    }

    const overview = document.querySelector("#updateMoviesModal .overview").value;
    if (!overview) {
        alert("Please enter an overview");
        return;
    }

    const coverUrl = document.querySelector("#updateMoviesModal .coverUrl").value;
    if (!coverUrl) {
        alert("Please enter a cover URL");
        return;
    }

    const fragmanUrl = document.querySelector("#updateMoviesModal .fragmanUrl").value;
    if (!fragmanUrl) {
        alert("Please enter a trailer URL");
        return;
    }

    const watchUrl = document.querySelector("#updateMoviesModal .watchUrl").value;
    if (!watchUrl) {
        alert("Please enter a watch URL");
        return;
    }

    const imdb = document.querySelector("#updateMoviesModal .imdbUrl").value;
    if (!imdb) {
        alert("Please enter an IMDB rating");
        return;
    }

    const runtime = document.querySelector("#updateMoviesModal .runtime").value;
    if (!runtime) {
        alert("Please enter runtime");
        return;
    }

    const category = document.querySelector("#updateMoviesModal .category").value;
    if (!category) {
        alert("Please select a category");
        return;
    }

    const actorInput = document.querySelector("#updateMoviesModal .actor");
    const actors = Array.from(actorInput.selectedOptions).map(option => parseInt(option.value));
    if (actors.length === 0) {
        alert("Please select at least one actor");
        return;
    }

    const adult = document.querySelector("#updateMoviesModal .adult").checked;

    const body = {
        title: title,
        overview: overview,
        cover_url: coverUrl,
        fragman: fragmanUrl,
        watch_url: watchUrl,
        imdb: imdb,
        run_time_min: parseInt(runtime),
        category: parseInt(category),
        actors: actors,
        adult: adult
    };

    console.log("Updating movie:", body);
    const token = localStorage.getItem("token");

    fetch(`${MOVIE_URL}/${currentMovieId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Movie updated:", resp);
        currentMovieId = null;
        loadMovies();
        updateModalInstance.hide();
    })
    .catch(error => {
        console.error("Error updating movie:", error);
        alert("Error updating movie");
    });
}