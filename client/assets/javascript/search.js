console.log("Search started");

let moviesData = [];
let currentPage = 1;
let itemsPerPage = 7;

// API URLs
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIES_URL = `${BASE_URL}/movies`
// Initialize - Load movies on page load
loadMovies();


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
            displayMovies(moviesData);
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
                <div class="card position-relative border-0" style="background-color: #1a1a1a">
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