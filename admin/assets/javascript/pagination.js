// function renderPagination(totalPages, currentPage, callback) {
//   const paginationContainer = document.getElementById("pagination");
//    if (!paginationContainer) return;
//   paginationContainer.innerHTML = "";

//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;
//     btn.classList.add("page-btn");
//     if (i === currentPage) btn.classList.add("active");

//     btn.addEventListener("click", () => {
//       callback(i);
//     });

//     paginationContainer.appendChild(btn);
//   }
// }
// window.renderPagination = renderPagination
// document.addEventListener("DOMContentLoaded", () => {
//   renderPagination(10, 1, window.fetchMovies); // pagination çağır
// });


