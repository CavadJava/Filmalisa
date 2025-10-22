console.log("Comments started");

// API URLs - Comments API endpoint-ləri
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const COMMENT_URL = `${API_BASE}/admin/comment`;
const COMMENTS_URL = `${API_BASE}/admin/comments`;
const USERS_URL = `${API_BASE}/admin/users`;
const MOVIES_URL = `${API_BASE}/admin/movies`;

// Global variables - Hazırda seçilmiş comment ID-si
let currentCommentId = null;

// Bootstrap modal instances - Modal nümunələri
const createModalEl = document.getElementById("createCommentsModal");
const viewModalEl = document.getElementById("viewCommentsModal");
const deleteModalEl = document.getElementById("deleteCommentsModal");
const createModalInstance = new bootstrap.Modal(createModalEl);
const viewModalInstance = new bootstrap.Modal(viewModalEl);
const deleteModalInstance = new bootstrap.Modal(deleteModalEl);

// Initialize - Səhifə yükləndikdə comments-ləri, user-ləri və movie-ləri yüklə
loadComments();
loadUsers();
loadMovies();

// Setup event listeners - Event listener-ləri quraşdır
const createBtn = document.querySelector('.createBtnOnModal');
if (createBtn) {
    createBtn.addEventListener("click", handleCreateComment);
}

// View modal üçün event listener lazım deyil - onclick ilə açılır
const deleteBtn = document.querySelector('.deleteBtnOnModal');
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteComment);
}

// Clear create form when modal is closed - Modal bağlananda formu təmizlə
createModalEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById('commentForm').reset();
});

// Load users - İstifadəçiləri yüklə və select-ə doldur
function loadUsers() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(USERS_URL, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Users loaded:", resp);
        const userSelect = document.getElementById("userId");
        if (userSelect && resp.data) {
            userSelect.innerHTML = '<option value="">Select User</option>';
            resp.data.forEach(user => {
                userSelect.innerHTML += `<option value="${user.id}">${user.email}</option>`;
            });
        }
    })
    .catch(error => console.error("Error loading users:", error));
}

// Load movies - Filmləri yüklə və select-ə doldur
function loadMovies() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(MOVIES_URL, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Movies loaded:", resp);
        const movieSelect = document.getElementById("movieId");
        if (movieSelect && resp.data) {
            movieSelect.innerHTML = '<option value="">Select Movie</option>';
            resp.data.forEach(movie => {
                movieSelect.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;
            });
        }
    })
    .catch(error => console.error("Error loading movies:", error));
}

// Load and display comments - Bütün comment-ləri yüklə və göstər
function loadComments() {
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
    })
    .then(resp => {
        console.log("Comments loaded:", resp);
        displayComments(resp.data);
    })
    .catch(error => {
        console.error("Error loading comments:", error);
        alert("Error loading comments");
    });
}

// Display comments in table - Comment-ləri cədvəldə göstər
function displayComments(comments) {
    const tbody = document.querySelector("table tbody");
    
    if (!tbody) {
        console.error("Table body not found");
        return;
    }
    
    tbody.innerHTML = "";
    
    if (!comments || comments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No comments found</td></tr>';
        return;
    }
    
    comments.forEach(cm => {
        console.log("Comment data:", cm); // Debug üçün
        const row = `
            <tr>
                <td>${cm.id}</td>
                <td>${cm.user?.full_name || cm.full_name || ''}</td>
                <td>${cm.user?.email || cm.email || ''}</td>
                <td>${cm.movie?.title || cm.movie.title || ''}</td>
                <td class="crop">${cm.comment || ''}</td>
                <td>
                    <button class="action-btn" onclick="openViewModal(${cm.id},${cm.movie.id},'${cm.comment}')">
                        <i class="fa-solid fa-eye text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${cm.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Handle create comment - Yeni comment yarat
function handleCreateComment() {
    const comment = document.querySelector("#createCommentsModal #comment").value;
    if (!comment) {
        alert("Please enter a comment");
        return;
    }

    const userId = document.querySelector("#createCommentsModal #userId").value;
    if (!userId) {
        alert("Please enter user ID");
        return;
    }

    const movieId = document.querySelector("#createCommentsModal #movieId").value;
    if (!movieId) {
        alert("Please enter movie ID");
        return;
    }

    const body = {
        comment: comment,
        user_id: parseInt(userId),
        movie_id: parseInt(movieId)
    };

    console.log("Creating comment:", body);
    const token = localStorage.getItem("token");

    fetch(COMMENT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Comment created:", resp);
        loadComments();
        createModalInstance.hide();
        document.getElementById('commentForm').reset();
    })
    .catch(error => {
        console.error("Error creating comment:", error);
        alert("Error creating comment");
    });
}

// Open view modal - View modalını aç və məlumatları göstər
function openViewModal(id, movieId, comment) {
    currentCommentId = id;
    currentMovieId = movieId;
    console.log("Opening view modal for comment ID:", currentCommentId);

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    if(viewModalInstance){
        // Show modal
        document.querySelector("#viewComment").textContent = comment;
        console.log(currentCommentId);
        viewModalInstance.show()
    }

}

// Open delete modal - Delete modalını aç
function openDeleteModal(commentId) {
    currentCommentId = commentId;
    deleteModalInstance.show();
}

// Update funksiyası artıq lazım deyil - View modal-da yalnız oxumaq olur

// Handle delete comment - Comment-i sil
function handleDeleteComment() {
    if (!currentCommentId) {
        alert("No comment selected");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    console.log("Deleting comment ID:", currentCommentId);

    fetch(`${COMMENT_URL}/${currentCommentId}`, {
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
        console.log("Comment deleted:", resp);
        currentCommentId = null;
        loadComments();
        deleteModalInstance.hide();
    })
    .catch(error => {
        console.error("Error deleting comment:", error);
        alert("Error deleting comment");
    });
}

