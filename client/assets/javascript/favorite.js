// Token localStorage-dən götürülür
const token = localStorage.getItem("token");

//API bazası 
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites";
if (!token) window.location.href = "/Filmalisa/admin/pages/login.html";


// 1. Sevimliləri gətir (GET)
async function getFavorites() {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
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
    let container = document.querySelector(".favorite-container");

    let result = "";

    favorites.forEach(category => {
        let categoryRow = `
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
        if(category.movies.length>0) {
            category.movies.forEach((movieRow) => {
                categoryRow +=
                    `
                        <div class="col">
                            <div class="card position-relative border-0">
                                <img src="${movieRow.cover_url}" style="width:292px; height:440px" class="card-img-top favorite-card-img"
                                     alt="...">
                                <div class="card-body position-absolute border-0" style="bottom:0px">
                                    <h5 class="card-title favorite-card-title" style="color:#0FEFFD; font-size:14px;font-weight:400">
                                    ${movieRow.title}
                                    </h5>
                                    <p class="card-text" >⭐ ${movieRow.imdb}
                                    </p>
                                    <p class="card-text favorite-card-title-text" style="font-size:32px">
                                        <small class="text-white">${movieRow.title}</small></p>
                                </div>
                            </div>
                        </div>
                    `;
            })
        }
        categoryRow+="</div></div>"
        result += categoryRow;
    });
    container.innerHTML = result;
}

getFavorites();


getFavorites();


