// Token localStorage-dən götürülür
const token = localStorage.getItem("token");

// API bazası 
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const FAVORITES_URL = `${BASE_URL}/movies/favorites`;

if (!token) window.location.href = "/Filmalisa/index.html";

// Get favorites from API
async function getFavorites() {
    try {
        const res = await fetch(FAVORITES_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        console.log("Favorite movies:", data);

        renderFavorites(data.data);
    } catch (err) {
        console.error("Error:", err);
        alert("Failed to load favorite movies!");
    }
}

function renderFavorites(movies) {
    const container = document.getElementById('favorites-carousel');

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No favorite movies yet.</p>';
        return;
    }

    // Split all movies into items of 6 for each carousel slide
    const items = itemsArray(movies, 6);

    let html = `
        <div class="carousel-inner">
    `;

    // Create carousel items
    items.forEach((item, index) => {
        const activeClass = index === 0 ? 'active' : '';
        html += `
            <div class="carousel-item ${activeClass}">
                <div class="row g-3">
        `;

        // Add movies to this slide
        item.forEach(movie => {
            const categoryName = movie.category?.name || 'Other';
            const imdbRating = movie.imdb || '';

            html += `
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="movie-card" onclick="window.location.href='detail.html?id=${movie.id}'">
                        <img src="${movie.cover_url}"
                             alt="${movie.title}">
                        <div class="movie-info" style="pad">
                            <div class="movie-category">${categoryName}</div>
                            <div class="movie-rating">⭐ ${imdbRating}</div>
                            <div class="movie-title">${movie.title}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;
    });

    html += `
                </div>

                ${items.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#favorites-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#favorites-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
                ` : ''}
    `;

    container.innerHTML = html;
}

function itemsArray(array, size) {
    const items = [];
    for (let i = 0; i < array.length; i += size) {
        items.push(array.slice(i, i + size));
    }
    return items;
}

getFavorites();

