console.log("Categories started");

let categoryData = [];
let currentPage = 1;
let itemsPerPage = 10;

// API URLs
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const CATEGORY_URL = `${API_BASE}/category`;
const CATEGORIES_URL = `${API_BASE}/categories`;

// Global variables
let currentCategoryId = null;

// Bootstrap modal instances
const updateModalEl = document.getElementById('updateCategoryModal');
const deleteModalEl = document.getElementById('removeCategoryModal');
const updateModalInstance = new bootstrap.Modal(updateModalEl);
const deleteModalInstance = new bootstrap.Modal(deleteModalEl);

// Initialize - Load categories on page load
loadCategories();

// Auth
setTimeout(auth,3000)

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        window.location.href = "/Filmalisa/client/pages/home.html";
    }
}

// Setup event listeners
const createBtn = document.querySelector('.createBtnOnModal');
if (createBtn) {
    createBtn.addEventListener('click', handleCreateCategory);
}

const updateBtn = document.querySelector('.updateBtnOnModal');
if (updateBtn) {
    updateBtn.addEventListener('click', handleUpdateCategory);
}

const deleteBtn = document.querySelector('.yesBtn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDeleteCategory);
}

// Clear form when create modal is closed
const createModal = document.getElementById('createCategoryModal');
if (createModal) {
    createModal.addEventListener('hidden.bs.modal', function () {
        document.querySelector('#createCategoryModal .title').value = '';
    });
}

// Load and display categories
function loadCategories() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found");
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
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(resp => {
        console.log("Categories loaded:", resp);
        categoryData = resp['data'];
        displayPage(1);
    })
    .catch(error => {
        console.error("Error loading categories:", error);
    });
}

function displayPage(page){
    currentPage = page;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageData = categoryData.slice(startIndex, endIndex);
    setUserList(pageData, page);
    setPagination();
}

function setUserList(data, page){
    let result = "";
    let startIndex = (page - 1) * itemsPerPage;

    data.forEach((category, index) => {
        let order = startIndex + index + 1;
        let row = `
            <tr>
                <td id="categoryId" style="display: none">${order.id}</td>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal(${category.id}, '${category.name.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${category.id})">
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
    let totalPages = Math.ceil(categoryData.length / itemsPerPage);

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
// Display categories in table
function displayCategories(categoryList) {
    const tbody = document.querySelector(".page-table-container tbody");

    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    tbody.innerHTML = "";

    if (!categoryList || categoryList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No categories found</td></tr>';
        return;
    }

    categoryList.forEach(category => {
        const row = `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal(${category.id}, '${category.name.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-pen-to-square text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${category.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Handle create category
function handleCreateCategory() {
    const titleInput = document.querySelector("#createCategoryModal .title");
    const title = titleInput.value.trim();

    if (!title) {
        alert("Please enter a category name");
        return;
    }

    const token = localStorage.getItem("token");

    fetch(CATEGORY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: title })
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Category created:", resp);
        titleInput.value = '';
        loadCategories();
    })
    .catch(error => {
        console.error("Error creating category:", error);
        alert("Error creating category");
    });
}


// Open update modal
function openUpdateModal(categoryId, categoryName) {
    currentCategoryId = categoryId;
    const titleInput = document.querySelector("#updateCategoryModal .title");

    if (titleInput) {
        titleInput.value = categoryName;
    }

    // Show modal using Bootstrap
    const updateModal = new bootstrap.Modal(document.getElementById('updateCategoryModal'));
    updateModal.show();
}

// Handle update category
function handleUpdateCategory() {
    const titleInput = document.querySelector("#updateCategoryModal .title");
    const title = titleInput.value.trim();

    if (!title) {
        alert("Please enter a category name");
        return;
    }

    if (!currentCategoryId) {
        alert("No category selected");
        return;
    }

    const token = localStorage.getItem("token");

    fetch(`${CATEGORY_URL}/${currentCategoryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: title })
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Category updated:", resp);
        currentCategoryId = null;
        loadCategories();

        // Close modal
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateCategoryModal'));
        if (updateModal) {
            updateModal.hide();
        }
    })
    .catch(error => {
        console.error("Error updating category:", error);
        alert("Error updating category");
    });
}

// Open delete modal
function openDeleteModal(categoryId) {
    currentCategoryId = categoryId;

    // Show modal
    if (deleteModalInstance) {
        deleteModalInstance.show();
    }
}

// Handle delete category
function handleDeleteCategory() {
    if (!currentCategoryId) {
        alert("No category selected");
        return;
    }

    const token = localStorage.getItem("token");

    fetch(`${CATEGORY_URL}/${currentCategoryId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(resp => {
        console.log("Category deleted:", resp);
        currentCategoryId = null;
        loadCategories();

        // Close modal
        if (deleteModalInstance) {
            deleteModalInstance.hide();
        }
    })
    .catch(error => {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
    });
}
