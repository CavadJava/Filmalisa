console.log("Actors started");

let userData = [];
let currentPage = 1;
let itemsPerPage = 10;

// API URLs - Actors API endpoint-ləri
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const ACTOR_URL = `${API_BASE}/admin/actor`;
const ACTORS_URL = `${API_BASE}/admin/actors`;

// Global variables - Hazırda seçilmiş actor ID-si
let currentActorId = null;

// Bootstrap modal instances - Modal nümunələri
const createModalEl = document.getElementById("createActorModal");
const updateModalEl = document.getElementById("updateActorModal");
const deleteModalEl = document.getElementById("actorModalAlert");
const createModalInstance = new bootstrap.Modal(createModalEl);
const updateModalInstance = new bootstrap.Modal(updateModalEl);
const deleteModalInstance = new bootstrap.Modal(deleteModalEl);

// Initialize - Səhifə yükləndikdə actors-ləri yüklə
loadActors();

// Auth
setTimeout(auth,3000)

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        localStorage.removeItem("role")
    }
}

// Setup event listeners - Event listener-ləri quraşdır
const createBtn = document.querySelector('.createBtnOnModal');
if (createBtn) {
    createBtn.addEventListener("click", handleCreateActor);
}

const updateBtn = document.querySelector('.updateBtnOnModal');
if (updateBtn) {
    updateBtn.addEventListener("click", handleUpdateActor);
}

const deleteBtn = document.querySelector('.deleteBtnOnModal');
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteActor);
}

// Clear create form when modal is closed - Modal bağlananda formu təmizlə
createModalEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById('actorForm').reset();
});

// Load and display actors - Bütün actor-ları yüklə və göstər
function loadActors() {
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
    })
    .then(resp => {
        console.log("Actors loaded:", resp);
        userData = resp['data'];
        displayPage(1);
    })
    .catch(error => {
        console.error("Error loading actors:", error);
        alert("Error loading actors");
    });
}

function displayPage(page){
    currentPage = page;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageData = userData.slice(startIndex, endIndex);
    setUserList(pageData, page);
    setPagination();
}

function setUserList(data, page){
    let result = "";
    let startIndex = (page - 1) * itemsPerPage;

    data.forEach((actor, index) => {
        let order = startIndex + index + 1;
        let row = `
            <tr>
                <td  id="actorId" style="display: none">${actor.id}</td>
                <td>${order}</td>
                <td class="movie-image"><img src="${actor.img_url || ''}" alt="${actor.name}" class="actor-image"></td>
                <td>${actor.name}</td>
                <td>${actor.surname || 'N/A'}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal('${actor.id}','${actor.name}','${actor.surname}','${actor.img_url}')">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${actor.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        result += row;
    });
    document.querySelector(".page-table tbody").innerHTML = result;
}


function setPagination(){
    let totalPages = Math.ceil(userData.length / itemsPerPage);

    if(totalPages > 0) {
        let result = `<ul class="pagination">`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            result += `<li class="page-item ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">
                <a class="page-link"">${i}</a>
            </li>`;
        }

        result += `</ul>`;
        document.querySelector(".pagination").innerHTML = result;
    }
}

//Deprecated
function displayActors(actors) {
    const tbody = document.querySelector("table tbody");

    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    tbody.innerHTML = "";

    if (!actors || actors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No actors found</td></tr>';
        return;
    }

    actors.forEach(actor => {
        const row = `
            <tr>
                <td>${actor.id}</td>
                <td class="movie-image"><img src="${actor.img_url || ''}" alt="${actor.name}" class="actor-image"></td>
                <td>${actor.name}</td>
                <td>${actor.surname || 'N/A'}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal('${actor.id}','${actor.name}','${actor.surname}','${actor.img_url}')">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${actor.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Handle create actor - Yeni actor yarat
function handleCreateActor() {
    const name = document.querySelector("#createActorModal #name").value;
    if (!name) {
        alert("Please enter actor name");
        return;
    }

    const surname = document.querySelector("#createActorModal #surname").value;
    if (!surname) {
        alert("Please enter actor surname");
        return;
    }

    const imageUrl = document.querySelector("#createActorModal #imageUrl").value;
    if (!imageUrl) {
        alert("Please enter image URL");
        return;
    }

    const body = {
        name: name,
        surname: surname,
        img_url: imageUrl
    };

    console.log("Creating actor:", body);
    const token = localStorage.getItem("token");

    fetch(ACTOR_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Actor created:", resp);
        loadActors();
        createModalInstance.hide();
        document.getElementById('actorForm').reset();
    })
    .catch(error => {
        console.error("Error creating actor:", error);
        alert("Error creating actor");
    });
}

// Open update modal - Update modalını aç və məlumatları doldur
function openUpdateModal(actor_id, name, surname, img_url) {
    currentActorId = actor_id;
    console.log("Opening update modal for actor ID:", currentActorId);
    
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }
        
    // Populate form fields
    document.querySelector("#updateActorModal #name2").value = name || '';
    document.querySelector("#updateActorModal #surname2").value = surname || '';
    document.querySelector("#updateActorModal #imageUrl2").value = img_url || '';

    // Show modal
    updateModalInstance.show();
}

// Open delete modal - Delete modalını aç
function openDeleteModal(actorId) {
    currentActorId = actorId;
    deleteModalInstance.show();
}

// Handle update actor - Actor-u yenilə
function handleUpdateActor() {
    const name = document.querySelector("#updateActorModal #name2").value;
    if (!name) {
        alert("Please enter actor name");
        return;
    }

    const surname = document.querySelector("#updateActorModal #surname2").value;
    if (!surname) {
        alert("Please enter actor surname");
        return;
    }

    const imageUrl = document.querySelector("#updateActorModal #imageUrl2").value;
    if (!imageUrl) {
        alert("Please enter image URL");
        return;
    }

    const body = {
        name: name,
        surname: surname,
        img_url: imageUrl
    };

    console.log("Updating actor:", body);
    const token = localStorage.getItem("token");

    fetch(`${ACTOR_URL}/${currentActorId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Actor updated:", resp);
        currentActorId = null;
        loadActors();
        updateModalInstance.hide();
    })
    .catch(error => {
        console.error("Error updating actor:", error);
        alert("Error updating actor");
    });
}

// Handle delete actor - Actor-u sil
function handleDeleteActor() {
    if (!currentActorId) {
        alert("No actor selected");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    console.log("Deleting actor ID:", currentActorId);

    fetch(`${ACTOR_URL}/${currentActorId}`, {
        method: "DELETE",
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
        console.log("Actor deleted:", resp);
        currentActorId = null;
        loadActors();
        deleteModalInstance.hide();
    })
    .catch(error => {
        console.error("Error deleting actor:", error);
        alert("Error deleting actor");
    });
}

