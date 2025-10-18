function fetchMovies() {
    const token = localStorage.getItem("token")
    if (!token) {
        alert ("Please log in")
        return
        
    }
    fetch ("https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies", {
        
            method : "GET",
            headers : {
                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`
            }
        })

        .then(response => {
            if (!response.ok) {
                throw new Error("API error: " + response.status);
                
            }
            return response.json()
        })
        .then(result => {
            console.log(result.data);
            displayMovies (result.data)
            
        })
        .catch(err => console.log("Fetch error:", err));
        
    
    
}
function displayMovies(movies) {
    let result = "";
    movies.forEach(movie => {
            let row = `
            <tr>
                <td>${movie.id}</td>
                <td class="movie-image"><img src="${movie.cover_url}" alt="John Carroll Lynch" class="actor-image"></td>
                <td>${movie.title}</td>
                <td class="movie-overview crop" >${movie.overview}</td>
                <td>${movie.category['name']}</td>
                <td>${movie.imdb}</td>
                <td>
                    <button class="action-btn moviesModal" style="border:none; background-color: transparent;" data-bs-toggle="modal" data-bs-target="#moviesModal">
                    <i class="fa-solid fa-pen-to-square text-dark" style="cursor: pointer; "></i></button>
                </td>
                <td>
                    <button class="action-btn moviesModalAlert" style="border:none; background-color: transparent;" data-bs-toggle="modal" data-bs-target="#moviesModalAlert">
                     <i class="fa-solid fa-trash text-dark" style="cursor: pointer; "></i></button>
                </td>
            </tr>
            `;
            result+=row;
        });
    document.querySelector("table tbody").innerHTML = result;

}
document.addEventListener("DOMContentLoaded", fetchMovies);
