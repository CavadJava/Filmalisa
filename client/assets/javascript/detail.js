console.log("Detail page started");

// API Base url
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const MOVIES_URL = `${BASE_URL}/movies`;

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Check authentication
if (!localStorage.getItem("token")) {
    window.location.href = "/Filmalisa/client/pages/login.html";
}

let fragman = document.querySelector('.movie-iframe-fragman');
const imageModalEl = document.getElementById("imageModal");
const createModalInstance = new bootstrap.Modal(imageModalEl);


// Load movie details on page load
if (movieId) {
    loadMovieDetails(movieId);
} else {
    console.error("No movie ID provided");
    alert("Film ID tapılmadı!");
}

// Load Movie Details
function loadMovieDetails(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${MOVIES_URL}/${id}`, {
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
            console.log("Movie details loaded:", resp);
            const movie = resp.data;
            displayMovieDetails(movie);
        })
        .catch(error => {
            console.error("Error loading movie details:", error);
            alert("Film məlumatları yüklənərkən xəta baş verdi!");
        });
}

// Display Movie Details
function displayMovieDetails(movie) {
    // Update hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && movie.cover_url) {
        heroSection.style.backgroundImage = `url(${movie.cover_url})`;
    }

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.textContent = movie.title || 'N/A';
    }

    const heroCategory = document.querySelector('.hero-breadcrumb');
    if (heroCategory && movie.category) {
        heroCategory.textContent = `Filmalisa / ${movie.category.name || 'Movies'}`;
    }

    // Update movie poster
    const watchLink = document.querySelector('.watch-link');
    if (watchLink && movie.watch_url) {
        watchLink.href = movie.watch_url;
        watchLink.alt = movie.title;
        watchLink.style = "text-decoration:none";
    }

    // Update movie poster
    const detailImg = document.querySelector('.detail-img');
    if (detailImg && movie.cover_url) {
        document.addEventListener("click", () => {
            detailImg.src = movie.cover_url;
            detailImg.alt = movie.title;
        })
    }

    // Update movie poster
    const movieDetailImg = document.querySelector('.movie-detail-img');
    if (movieDetailImg && movie.cover_url) {
        movieDetailImg.src = movie.cover_url;
        movieDetailImg.alt = movie.title;
    }

    // Update trailer iframe
    if (fragman && movie.fragman) {
        // Convert YouTube URL to embed format if needed
        let embedUrl = movie.fragman;

        // Check if it's a regular YouTube URL and convert to embed format
        if (embedUrl.includes('youtube.com/watch?v=')) {
            const videoId = embedUrl.split('v=')[1]?.split('&')[0];
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        // Add YouTube parameters for better control
        const separator = embedUrl.includes('?') ? '&' : '?';
        embedUrl += `${separator}enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`;
        fragman.innerHTML = `
            <iframe src="${embedUrl}"
             title="YouTube video player"
              frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               referrerpolicy="strict-origin-when-cross-origin"
                style="width: 100%; height: 100%"
                 class="iframe-fragman"
                  id="widget2">      
            </iframe>
            `;
    }

    // Update favorite button
    const favoriteBtn = document.querySelector('.btn-favorite');
    if (favoriteBtn) {
        favoriteBtn.setAttribute('data-id', movie.id);
        // Check if movie is favorite
        if (movie.is_favorite) {
            favoriteBtn.classList.add('active');
            favoriteBtn.innerHTML = '<span><i class="fa-solid fa-check"></i></span>';
            favoriteBtn.style.backgroundColor = '#0FEFFD';
            favoriteBtn.style.color = 'black';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteBtn.innerHTML = '<span><i class="fa-solid fa-plus"></i></span>';
            favoriteBtn.style.backgroundColor = 'black';
            favoriteBtn.style.color = 'white';
        }
    }

    // Update description
    const descriptionElement = document.querySelector('.movie-description');
    if (descriptionElement) {
        descriptionElement.textContent = movie.overview || 'Təsvir mövcud deyil';
    }

    // Update IMDB rating
    const imdbElement = document.querySelector('#movie-imdb span#rate');
    if (imdbElement) {
        imdbElement.textContent = movie.imdb || 'N/A';
    }

    // Update category
    const categoryElement = document.querySelector('.hero-category-name');
    if (categoryElement && movie.category) {
        categoryElement.textContent = movie.category.name || 'N/A';
    }

    // Update runtime
    const runtimeElement = document.querySelector('.movie-runtime');
    if (runtimeElement) {
        runtimeElement.textContent = movie.run_time_min ? `${movie.run_time_min} min` : 'N/A';
    }

    // Update adult/age rating
    const adultElement = document.querySelector('.movie-adult');
    if (adultElement) {
        if (movie.adult) {
            adultElement.innerHTML = '<span class="badge bg-danger">18+</span>';
        } else {
            adultElement.innerHTML = '<span class="badge bg-success">All Ages</span>';
        }
    }

    // Update created date
    const createdAtElement = document.querySelector('.movie-created-at');
    if (createdAtElement && movie.created_at) {
        const date = new Date(movie.created_at);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        createdAtElement.textContent = formattedDate;
    }

    // Update actors/cast
    if (movie.actors && movie.actors.length > 0) {
        displayActors(movie.actors);
    }

    // Load similar movies
    if (movie.category && movie.category.id) {
        loadSimilarMovies(movie.category.id, movie.id);
    }
}

// Display Actors
function displayActors(actors) {
    const castContainer = document.querySelector('.cast-grid');
    if (!castContainer) return;

    castContainer.innerHTML = '';

    actors.forEach(actor => {
        const fullName = `${actor.name || ''} ${actor.surname || ''}`.trim();
        const actorCard = `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 text-center">
                 <img src="${actor.img_url || '../assets/images/detail/images-1.png'}" class="img-fluid rounded" alt="${fullName}">
                 <div class="fw-semibold mt-2">${fullName || 'N/A'}</div>
                 <div class="text-secondary small">Actor</div>
            </div>
        `;
        castContainer.innerHTML += actorCard;
    });
}

// Load Similar Movies
function loadSimilarMovies(categoryId, currentMovieId) {
    const token = localStorage.getItem("token");
    if (!token) return;

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
            console.log("All movies loaded:", resp);
            // Filter movies by same category and exclude current movie
            const similarMovies = resp.data
                .filter(movie => movie.category && movie.category.id === categoryId && movie.id !== currentMovieId)
                .slice(0, 3); // Get only 3 similar movies

            displaySimilarMovies(similarMovies);
        })
        .catch(error => {
            console.error("Error loading similar movies:", error);
        });
}

// Display Similar Movies
function displaySimilarMovies(movies) {
    // Similar movies display removed - no container in HTML
    console.log("Similar movies:", movies);
}

// Load Action Movies
loadMoviesAction();

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
            let actionResult = ""
            resp.data.forEach((movie) => {
                switch (movie.category.name) {
                    case 'Action': {
                        let row = `<div class="col">
                        <div class="card position-relative border-0" style="cursor: pointer;" onclick="window.location.href='detail.html?id=${movie.id}'">
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
                        actionResult += row;
                    }
                }
            });
            actionGroup.innerHTML = actionResult;

        })
        .catch(error => console.error("Error loading movies:", error));
}