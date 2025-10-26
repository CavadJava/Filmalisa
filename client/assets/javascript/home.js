console.log("Home page started");

// API BASE

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIES_URL = `${API_BASE}/movies`
const CATEGORY_URL = `${API_BASE}/categories`


// check session
if (!localStorage.getItem("token")) window.location.href = "/Filmalisa/admin/pages/login.html";

const watchButton = document.querySelector(".watch-button");

// Load Carousel Movies
loadMoviesForCarousel();

// Load Category Movies;
loadCategoryMovies();

function setCarouselSide(movie, index, carouselItems) {
    let watchUrl = movie.watch_url;
    let row = `
                <div class="carousel-items-part">
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${movie.cover_url}" class="d-block w-100 carousel-custom-img" alt="${movie.title}">
                    </div>
                </div>
                `;
    watchButton.addEventListener("click", () => {
        window.open(watchUrl, '_blank');
    })
    carouselItems.innerHTML += row;
}

// Load movies
function loadMoviesForCarousel() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(MOVIES_URL, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })
        .then(response => response.json())
        .then(resp => {
            console.log("Movies loaded:", resp);
            let carouselItems = document.querySelector(".carousel-items-part");
            resp.data.forEach((movie,index) => {

                // load movies into carousel
                setCarouselSide(movie, index, carouselItems);
            });

        })
        .catch(error => console.error("Error loading movies:", error));
}

// Load Categories Movies
function loadCategoryMovies() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${CATEGORY_URL}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json()}
        ).then(data => {
            if (!data.result) throw new Error("Category Movies failed ");

            console.log("Category Movies:", data);
            renderFavorites(data.data);
        }).catch(error => {
            console.error("Error:", error);
        });
    } catch (err) {
        console.error("Xəta:", err);
    }
}

function renderFavorites(favorites) {
    let container = document.querySelector(".category-movies");

    let result = "";

    favorites.forEach(category => {
        let categoryRow = "";
        if(category.movies.length>0) {
            categoryRow = `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item text-white active favorite-breadcrumb"
                        style="font-size: 35px;font-weight: 500; padding-top: 162px"
                        aria-current="page">
                        ${category.name}
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7285 9.20767L20.9902 16.4694L13.7285 23.7311L12.7275 22.7301L18.9883 16.4694L18.458 15.9381L12.7275 10.2086L13.7285 9.20767Z"
                                  fill="#0FEFFD" stroke="white" stroke-width="1.5"/>
                        </svg>
                    </li>
                </ol>
            </nav>
            <div class="card-group favorite-card-group flex-wrap border-0">
                <div class="row row-cols-2 row-cols-lg-2 row-cols-sm-2 row-cols-md-2 g-3 border-0">`;
            category.movies.forEach((movieRow) => {
                categoryRow +=
                    `
                        <div class="col"> 
                            <div class="card position-relative border-0" onclick="window.location.href='detail.html?id=${movieRow.id}'">
                                <img src="${movieRow.cover_url}" style="width:292px; height:440px;cursor: pointer" class="card-img-top favorite-card-img"
                                     alt="...">
                                <div class="card-body position-absolute border-0" style="bottom:0">
                                    <h5 class="card-title favorite-card-title" style="color:#0FEFFD; font-size:14px;font-weight:400">
                                    ${movieRow.title}
                                    </h5>
                                    <p class="card-text" >⭐ ${movieRow.imdb}
                                    </p>
                                    <p class="card-text favorite-card-title-text" style="font-size:24px">
                                        <small class="text-white">${movieRow.title}</small></p>
                                </div>
                            </div>
                        </div>
                    `;
            });
        }
        categoryRow+="</div></div>"
        result += categoryRow;
    });
    container.innerHTML = result;
}