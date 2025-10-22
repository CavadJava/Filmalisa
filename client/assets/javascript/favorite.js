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
    return data;
  } catch (err) {
    console.error("Xəta:", err);
  }
}

// 2. Sevimlilərə əlavə et (POST /add)
async function addToFavorites(movieId) {
  try {
    const res = await fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/movie/${movieId}/favorite/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id: movieId }),
    });

    if (!res.ok) throw new Error("Favoritə əlavə olunmadı");

    const data = await res.json();
    console.log(`Film #${movieId} favoritlərə əlavə olundu:`, data);
    return data;
  } catch (err) {
    console.error("Xəta:", err);
  }
}

// 🔹 3. Sevimlilərdən sil (POST /remove)
async function removeFromFavorites(movieId) {
  try {
    const res = await fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/movie/${movieId}/favorite/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ id: movieId }),
    });

    if (!res.ok) throw new Error("Favoritdən silinmədi");

    const data = await res.json();
    console.log(`Film #${movieId} favoritlərdən silindi:`, data);
    return data;
  } catch (err) {
    console.error("Xəta:", err);
  }
}

// 🔹 4. Buton kliklərinə qoşmaq nümunəsi
// Məsələn, hər film üçün "favorite" düyməsi varsa:
document.querySelectorAll(".btn-circle").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const movieId = btn.dataset.id; // HTML-də data-id olacaq
    const isFavorite = btn.classList.contains("active");

    if (isFavorite) {
      await removeFromFavorites(movieId);
      btn.classList.remove("active");
       btn.querySelector(".icon i").classList.replace("fa-check", "fa-plus");
    } else {
      await addToFavorites(movieId);
      btn.classList.add("active");
       btn.querySelector(".icon i").classList.replace("fa-plus", "fa-check");
    }
  });
});
