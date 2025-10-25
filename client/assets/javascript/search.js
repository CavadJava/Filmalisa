console.log("Search started");

let moviesData = [];

// API URLs
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIES_URL = `${BASE_URL}/movies`
// Initialize - Load movies on page load

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("a .search-input");

// Load Movies
loadMovies();

if(searchBtn){
    searchBtn.addEventListener("click", () => loadMovies(searchInput.value));
}

// Load and display movies
function loadMovies(searchValue) {
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
            if(searchValue) {
                displayMovies(moviesData.filter(movie => movie.title.toLowerCase().includes(searchValue)));
            } else {
                displayMovies(moviesData);
            }
        })
        .catch(error => {
            console.error("Error loading movies:", error);
        });
}

// Display movies in table
function displayMovies(movies) {
    let result = "";
    movies.forEach(movie => {
        const row = `
            <div class="col">
                <div class="card position-relative border-0" style="background-color: #1a1a1a; cursor: pointer;" onclick="window.location.href='detail.html?id=${movie.id}'">
                    <img src="${movie.cover_url}" style="width:292px; height:440px" class="card-img-top favorite-card-img"
                         alt="...">
                    <div class="card-body position-absolute border-0" style="bottom:0px">
                        <h5 class="card-title favorite-card-title" style="color:#0FEFFD; font-size:14px;font-weight:400">
                        ${movie.title}
                        </h5>
                        <p class="card-text text-white">⭐ ${movie.imdb}
                        </p>
                        <p class="card-text favorite-card-title-text" style="font-size:32px">
                            <small class="text-white">${movie.title}</small></p>
                    </div>
                </div>
            </div>
        `;
        result += row;
    });
    document.querySelector(".search-card-group .row").innerHTML = result;
}