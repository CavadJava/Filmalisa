console.log("Dashboard started");

// URL
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const CATEGORIES_URL = `${API_BASE}/categories`;
const USERS_URL = `${API_BASE}/users`;
const MOVIES_URL = `${API_BASE}/movies`;
const ACTORS_URL = `${API_BASE}/actors`;
const CONTACT_URL = `${API_BASE}/contacts`;
const COMMENTS_URL = `${API_BASE}/comments`;

// Load Categories
categories();

// Load Users
users();

// Load Movies
movies();

// Load Contact
contacts();

// Load Actors
actors();

// Load Comments
comments();

// Auth
setTimeout(auth,3000)

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        localStorage.removeItem("role")
    }
}

// Handle Categories
function categories(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(resp => {
            document.querySelector(".categories h3").innerHTML = resp.data.length;
            console.log("Categories loaded:", resp);
        })
        .catch(error => {
            console.error("Error loading categories:", error);
        });
}

// Handle Users
function users(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(USERS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(resp => {
        document.querySelector(".users h3").innerHTML = resp.data.length;
        console.log("Users loaded:", resp);
    })
    .catch(error => {
        console.error("Error loading users:", error);
    });
}

// Handle movies
function movies(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(MOVIES_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(resp => {
        document.querySelector(".movies h3").innerHTML = resp.data.length;
        console.log("Movies loaded:", resp);
    })
    .catch(error => {
        console.error("Error loading movies:", error);
    });

}

// Handle contacts
function contacts(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(CONTACT_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(resp => {
        document.querySelector(".actors h3").innerHTML = resp.data.length;
        console.log("Contacts loaded:", resp);
    })
        .catch(error => {
            console.error("Error loading contacts:", error);
        });

}

// Handle actors
function actors(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(ACTORS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(resp => {
        document.querySelector(".actors h3").innerHTML = resp.data.length;
        console.log("Actors loaded:", resp);
    })
        .catch(error => {
            console.error("Error loading actors:", error);
        });

}

// Handle comments
function comments(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(COMMENTS_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(resp => {
        document.querySelector(".actors h3").innerHTML = resp.data.length;
        console.log("Comments loaded:", resp);
    })
        .catch(error => {
            console.error("Error loading comments:", error);
        });

}