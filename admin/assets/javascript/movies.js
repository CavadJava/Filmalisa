function fetchMovies() {
    const token = "9-v0b0pMu6ChCQnxPUKKWLmWDQkj9o68v4IEjzXJHwQ"
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
        .then(data => {
            console.log(data);
            displayMovies (data)
            
        })
        .catch(err => console.log("Fetch error:", err));
        
    
    
}
function displayMovies(movies) {
    const container = document.querySelector("#table tbody");
    tbody.innerHTML ="";
    movies.forEach(movie => {
        const tr = document.createElement("tr")
        const tdId = document.createElement("td")
        tdId.textContent = movie.id || "-";
        
        tr.appendChild(tdId);
        const tdTitle = document.createElement("td")
        tdTitle.textContent = movie.title || "-";
        tr.appendChild(tdTitle)
        tbody.appendChild(tr)
         
    });
    
}
document.addEventListener("DOMContentLoaded", fetchMovies);