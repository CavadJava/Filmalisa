// Token localStorage-dən götürülür
const token = localStorage.getItem("token");

//API bazası 
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites"; 

// 1. Sevimliləri gətir (GET)
async function getFavorites() {
  try {
    const res = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Favoritləri gətirmək alınmadı");

    const data = await res.json();
    console.log("Favorit siyahısı:", data);
   
     renderFavorites(data.data);
  } catch (err) {
    console.error("Xəta:", err);
  }
}

function renderFavorites(favorites) {
  const container = document.getElementById("favorites-container");
   
  container.innerHTML = "";

  favorites.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie-card");
    div.innerHTML = `
      <img src="${movie.cover_url}" alt="${movie.title}">
       <div class="movie-info">
        <p>${movie.category?.name || ""}</p>
        <h3>${movie.title}</h3>
        <div class="imdb">⭐ ${movie.imdb}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

getFavorites();


