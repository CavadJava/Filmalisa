



// let moviesData = [];
// let currentPage = 1;
// const itemsPerPage = 10; // hər səhifədə 10 film

// const token = localStorage.getItem("token");
// const MOVIES_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies";

// // İlk dəfə filmləri yüklə
// getMovies();

// async function getMovies() {
//     try {
//         const res = await fetch(`${MOVIES_URL}?page=${page}&limit=${itemsPerPage}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!res.ok) throw new Error("API xəta: " + res.status);

//         const data = await res.json();
//         moviesData = data.data; // bütün səhifələr üçün array yoxsa sadəcə cari səhifə
//         displayPage(page, data.totalPages);
//     } catch (err) {
//         console.error("Xəta:", err);
//     }
// }

// function displayPage(page, totalPages) {
//     currentPage = page;

//     // Table-i doldur
//     displayMovies(moviesData);

//     // Pagination yarat
//     const container = document.querySelector(".pagination");
//     container.innerHTML = "";

//     if (totalPages > 0) {
//         const ul = document.createElement("ul");
//         ul.className = "pagination";

//         for (let i = 1; i <= totalPages; i++) {
//             const li = document.createElement("li");
//             li.className = `page-item ${i === currentPage ? 'active' : ''}`;

//             const a = document.createElement("a");
//             a.className = "page-link";
//             a.textContent = i;

//             li.appendChild(a);
//             li.addEventListener("click", () => getMovies(i));

//             ul.appendChild(li);
//         }

//         container.appendChild(ul);
//     }
// }



// // const tbody = document.querySelector(".tbody");
// // const paginationContainer = document.getElementById("pagination");
// // const token = localStorage.getItem("token"); 
 
// // const limit = 10; // hər səhifədə 10 film


// // async function getMovies(page = 1) {
// //   try {
// //     const res = await fetch(`https://sənin-api-linkin.az/movies?page=${page}&limit=${limit}`, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "Content-Type": "application/json"
// //       }
// //     });

// //     if (!res.ok) throw new Error("API xəta: " + res.status);

// //     const data = await res.json();

// //     renderMovies(data.data);
// //     renderPagination(data.totalPages, page, getMovies); // pagination düymələri
// //   } catch (err) {
// //     console.error("Xəta:", err);
// //   }
// // }




// // function renderMovies(movies) {
// //   tbody.innerHTML = "";

// //   movies.forEach(movie => {
// //     const tr = document.createElement("tr");

// //     tr.innerHTML = `
// //       <td>${movie.id}</td>
// //       <td><img src="${movie.image}" width="50"></td>
// //       <td>${movie.title}</td>
// //       <td>${movie.overview}</td>
// //       <td>${movie.category}</td>
// //       <td>${movie.imdb}</td>
// //       <td><button class="edit-btn">Edit</button></td>
// //       <td><button class="remove-btn">Remove</button></td>
// //     `;

// //     tbody.appendChild(tr);
// //   });
// // }

// // pagination.js
// //  function renderPagination(totalPages, currentPage, onPageClick) {
// //   const paginationContainer = document.getElementById("pagination");
// //   if (!paginationContainer) return;

// //   paginationContainer.innerHTML = "";

// //   for (let i = 1; i <= totalPages; i++) {
// //     const btn = document.createElement("button");
// //     btn.textContent = i;
// //     if (i === currentPage) btn.disabled = true;

// //     btn.addEventListener("click", () => onPageClick(i));
// //     paginationContainer.appendChild(btn);
// //   }
// // }


// // ilk səhifəni göstər
// // getMovies(1);
