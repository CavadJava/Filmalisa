console.log("Home page started");

// API BASE

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIES_URL = `${API_BASE}/movies`

// check session
if (!localStorage.getItem("token")) window.location.href = "/Filmalisa/admin/pages/login.html";


// Load Action Movies
loadMoviesAction();
// Load Comedy Movies
loadMoviesComedy();

// Load movies
function loadMoviesAction() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(MOVIES_URL, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })
        .then(response => response.json())
        .then(resp => {
            console.log("Movies loaded:", resp);

            let actionGroup = document.querySelector(".action-card-group .row");
            let actionResult=  ""
            resp.data.forEach((movie) => {
                switch (movie.category.name) {
                    case 'Action': {
                        let row = `<div class="col">
                        <div class="card position-relative border-0">
                            <img src="${movie.cover_url}" style="width:292px;height:440px" class="card-img-top comedy-category-card-img"
                                 alt="...">
                                <div class="card-body position-absolute border-0" style="bottom:0px">
                                    <h5 class="card-title comedy-category-card-title" style="color:#0FEFFD; font-size:14px;font-weight:400">Sci-Fi &amp;
                                        ${movie.category.name}</h5>
                                    <p class="card-text" ><img src="../assets/images/favorite/rating.png"
                                                               style="object-fit: cover">
                                    </p>
                                    <p class="card-text comedy-category-card-title-text" style="font-size:32px">
                                        <small class="text-white">${movie.title}</small></p>
                                </div>
                            </div>
                        </div>`;
                        actionResult += row;
                    }
                }
            });
            actionGroup.innerHTML = actionResult;

        })
        .catch(error => console.error("Error loading movies:", error));
}
// Load comedy movies
function loadMoviesComedy() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(MOVIES_URL, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`}
    })
        .then(response => response.json())
        .then(resp => {
            console.log("Movies loaded:", resp);

            let comedyGroup = document.querySelector(".comedy-card-group .row");
            let comedyResult=  ""
            resp.data.forEach((movie) => {
                switch (movie.category.name) {
                    case 'Comedy': {
                        let row = `<div class="col">
                        <div class="card position-relative border-0">
                            <img src="${movie.cover_url}" style="width:504px;height:736px" class="card-img-top comedy-category-card-img"
                                 alt="...">
                                <div class="card-body position-absolute border-0" style="bottom:0px">
                                    <h5 class="card-title comedy-category-card-title" style="color:#0FEFFD; font-size:14px;font-weight:400">Sci-Fi &amp;
                                        ${movie.category.name}</h5>
                                    <p class="card-text" ><img src="../assets/images/favorite/rating.png"
                                                               style="object-fit: cover">
                                    </p>
                                    <p class="card-text comedy-category-card-title-text" style="font-size:32px">
                                        <small class="text-white">${movie.title}</small></p>
                                </div>
                            </div>
                        </div>`;
                        comedyResult+=row;
                    }
                }
            });
            comedyGroup.innerHTML = comedyResult;

        })
        .catch(error => console.error("Error loading movies:", error));
}
