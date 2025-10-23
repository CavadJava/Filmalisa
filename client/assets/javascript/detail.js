const token = localStorage.getItem("token");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

console.log(movieId);


if (!movieId) {
  alert("Movie ID tapılmadı!");
  window.location.href = "/Filmalisa/client/pages/landing.html"; 
}

 

fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
.then((data) => {
    console.log(data);
    

    // Poster (background-image)
   document.getElementById("movie-title").textContent = data.title || "Unknown";
   document.getElementById("movie-title2").textContent = data.title || "Unknown";
   document.getElementById("movie-genre").textContent =  data.category ? data.category.name : "No category";
   document.getElementById("movie-text").textContent = data.overview || "";
   document.getElementById("movie-poster-bg").style.backgroundImage = `url(${data.cover_url || '/client/assets/images/header.jpg'})`;
    const favoriteBtn = document.querySelector(".btn-circle");
    const moviePoster = document.querySelector(".detail-img img");
    // IMDb
    document.getElementById("movie-imdb").textContent = `IMDb: ${data.imdb}`;

    function updateFavoriteBtn(isFav) {
  const btn = document.querySelector('.btn-circle');
  if (isFav) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}

 updateFavoriteBtn(data.is_favorite);

    // Cast
    const castContainer = document.getElementById("topcast");
    castContainer.innerHTML = "";
    if (Array.isArray(data.actors) && data.actors.length > 0) {
    data.actors.forEach(actor => {
        const div = document.createElement("div");
        div.className = "col-6 col-sm-4 col-md-3 text-center";
        div.innerHTML = `
            <img src="${actor.img_url}" class="img-fluid rounded" alt="${actor.name} ${actor.surname}">
            <div class="fw-semibold mt-2">${actor.name} ${actor.surname}</div>
        `;
        document.getElementById("topcast").appendChild(div);
    });
}else{
     document.getElementById("topcast").innerHTML = "<p>No actors found.</p>";

     favoriteBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites/${movieId}`, {
      method: "POST", // POST = əlavə et, DELETE = sil (serverə bax)
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Favorite update failed");
    const result = await res.json();

    // Favorite düyməsini yenilə
    updateFavoriteBtn(result.favorite);
  } catch (err) {
    console.error(err);
    alert("Sevimlilərə əlavə/sil əməliyyatı alınmadı!");
  }
});

// Favorite düyməsini yeniləyən funksiya
function updateFavoriteBtn(isFavorite) {
  if (isFavorite) {
    favoriteBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    favoriteBtn.style.backgroundColor = "#FFAD49";
  } else {
    favoriteBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    favoriteBtn.style.backgroundColor = "black";
  }
}
}
    // Watch link
    const watchLink = document.getElementById("movie-link");
    watchLink.addEventListener("click", () => {
        window.open(data.watch_url, "_blank");
    })
    // watchLink.href = data.watch_url;

    // Fragman / trailer
    document.getElementById("trailer").src = data.fragman;
})
.catch(err => console.error(err));


