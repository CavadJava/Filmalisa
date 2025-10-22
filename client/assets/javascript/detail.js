const token = localStorage.getItem("token");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

 // əgər token tələb olunursa

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


    // IMDb
    document.getElementById("movie-imdb").textContent = `IMDb: ${data.imdb}`;


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

