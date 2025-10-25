console.log("Contacts started");

let contactData = [];
let currentPage = 1;
let itemsPerPage = 4;

// API URLs - Contacts API endpoint-ləri
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const CONTACT_URL = `${API_BASE}/admin/contact`;
const CONTACTS_URL = `${API_BASE}/admin/contacts`;
const POST_CONTACTS_URL = `${API_BASE}/contact`;

// Global variables - Hazırda seçilmiş contact ID-si
let currentContactId = null;

// Bootstrap modal instances - Modal nümunələri
const createModalEl = document.getElementById("createContactModal");
const updateModalEl = document.getElementById("updateContactModal");
const deleteModalEl = document.getElementById("contactModalAlert");
const createModalInstance = new bootstrap.Modal(createModalEl);
const updateModalInstance = new bootstrap.Modal(updateModalEl);
const deleteModalInstance = new bootstrap.Modal(deleteModalEl);

// Initialize - Səhifə yükləndikdə contacts-ləri yüklə
loadContacts();

// Auth
setTimeout(auth,3000)

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        window.location.href = "/Filmalisa/admin/pages/login.html";
    }
}

// Setup event listeners - Event listener-ləri quraşdır
const createBtn = document.querySelector('.createBtnOnModal');
if (createBtn) {
    createBtn.addEventListener("click", handleCreateContact);
}

const updateBtn = document.querySelector('.updateBtnOnModal');
if (updateBtn) {
    updateBtn.addEventListener("click", handleUpdateContact);
}

const deleteBtn = document.querySelector('.deleteBtnOnModal');
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteContact);
}

// Clear create form when modal is closed - Modal bağlananda formu təmizlə
createModalEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById('contactForm').reset();
});

// Load and display contacts - Bütün contact-ları yüklə və göstər
function loadContacts() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    fetch(CONTACTS_URL, {
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
            console.log("Contacts loaded:", resp);
            contactData = resp['data'];
            console.log(contactData)
            displayPage(1);
        }).catch(error => {
        console.error("Error loading contacts", error);
    });
}

function displayPage(page){
    currentPage = page;
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let pageData = contactData.slice(startIndex, endIndex);
    setUserList(pageData, page);
    setPagination();
}

function setUserList(data, page){
    let result = "";
    let startIndex = (page - 1) * itemsPerPage;

    data.forEach((contact, index) => {
        let order = startIndex + index + 1;
        let row = `
          <tr>
               <td id="userId" style="display: none">${contact.id}</td>
                <td>${order}</td>
                <td>${contact.full_name}</td>
                <td>${contact.email}</td>
                <td>${contact.reason || 'no message'}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal('${contact.id}', '${contact.full_name}', '${contact.email}', '${contact.reason}')">
                        <i class="fa-solid fa-eye text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${contact.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
          </tr>
        `;
        result += row;
    });
    document.querySelector(".page-table tbody").innerHTML = result;
}

// @Deprecated
// function setPagination(){
//     let totalPages = Math.ceil(contactData.length / itemsPerPage);
//
//     if(totalPages > 0) {
//         let result = `<ul class="pagination">`;
//
//         // Page numbers
//         for (let i = 1; i <= totalPages; i++) {
//             result += `<li class="page-item ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">
//                 <a class="page-link"">${i}</a>
//             </li>`;
//         }
//
//         result += `</ul>`;
//         document.querySelector(".pagination").innerHTML = result;
//     }
// }
function setPagination() {
    const totalPages = Math.ceil(contactData.length / itemsPerPage);
    const maxVisiblePages = 3; // eyni anda görünən səhifə sayı]
    let result = `<ul class="pagination">`;

    // Previous düyməsi
    result += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('prev')">Previous</a>
        </li>`;

    // Başlanğıc və son səhifə nömrələrini hesablayaq
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Əgər səhifələr azdırsa, aralığı düzəldirik
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Görünən səhifə nömrələri
    for (let i = startPage; i <= endPage; i++) {
        result += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="displayPage(${i})">${i}</a>
            </li>`;
    }

    // Next düyməsi
    result += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('next')">Next</a>
        </li>`;

    result += `</ul>`;
    document.querySelector(".pagination").innerHTML = result;
}

function changePage(direction) {
    const totalPages = Math.ceil(contactData.length / itemsPerPage);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    displayPage(currentPage);
}


// Deprecated
// Display contacts in table - Contact-ları cədvəldə göstər
function displayContacts(contacts) {
    const tbody = document.querySelector("table tbody");

    if (!tbody) {
        console.error("Table body not found");
        return;
    }

    tbody.innerHTML = "";

    if (!contacts || contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No contacts found</td></tr>';
        return;
    }

    contacts.forEach(contact => {
        const row = `
            <tr>
                <td>${contact.id}</td>
                <td>${contact.full_name}</td>
                <td>${contact.email}</td>
                <td>${contact.reason || 'no message'}</td>
                <td>
                    <button class="action-btn" onclick="openUpdateModal('${contact.id}', '${contact.full_name}', '${contact.email}', '${contact.reason}')">
                        <i class="fa-solid fa-eye text-dark"></i>
                    </button>
                </td>
                <td>
                    <button class="action-btn" onclick="openDeleteModal(${contact.id})">
                        <i class="fa-solid fa-trash text-dark"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Handle create contact - Yeni contact yarat
function handleCreateContact() {
    const fullName = document.querySelector("#createContactModal .fullName").value;
    if (!fullName) {
        alert("Please enter full name");
        return;
    }

    const email = document.querySelector("#createContactModal .email").value;
    if (!email) {
        alert("Please enter email");
        return;
    }

    const reason = document.querySelector("#createContactModal .reason").value;
    if (!reason) {
        alert("Please enter reason");
        return;
    }

    const body = {
        full_name: fullName,
        email: email,
        reason: reason
    };

    console.log("Creating contact:", body);
    const token = localStorage.getItem("token");

    fetch(POST_CONTACTS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(resp => {
            console.log("Contact created:", resp);
            loadContacts();
            createModalInstance.hide();
            document.getElementById('contactForm').reset();
        })
        .catch(error => {
            console.error("Error creating contact:", error);
            alert("Error creating contact");
        });
}

// Open update modal - Update modalını aç və məlumatları doldur
function openUpdateModal(contactId, full_name, email, reason) {
    currentContactId = contactId;
    console.log("Opening update modal for contact ID:", currentContactId);

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    // Populate form fields
    document.querySelector("#updateContactModal .fullName").value = full_name || '';
    document.querySelector("#updateContactModal .email").value = email || '';
    document.querySelector("#updateContactModal .reason").value = reason || '';

    // Show modal
    updateModalInstance.show();
}

// Handle update contact - Contact-ı yenilə
function handleUpdateContact() {
    const fullName = document.querySelector("#updateContactModal .fullName").value;
    if (!fullName) {
        alert("Please enter full name");
        return;
    }

    const email = document.querySelector("#updateContactModal .email").value;
    if (!email) {
        alert("Please enter email");
        return;
    }

    const reason = document.querySelector("#updateContactModal .reason").value;
    if (!reason) {
        alert("Please enter reason");
        return;
    }

    const body = {
        full_name: fullName,
        email: email,
        reason: reason
    };

    console.log("Updating contact:", body);
    const token = localStorage.getItem("token");

    fetch(`${CONTACT_URL}/${currentContactId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(resp => {
            console.log("Contact updated:", resp);
            currentContactId = null;
            loadContacts();
            updateModalInstance.hide();
        })
        .catch(error => {
            console.error("Error updating contact:", error);
            alert("Error updating contact");
        });

}


// Open delete modal - Delete modalını aç və məlumatları doldur
function openDeleteModal(contactId) {
    currentContactId = contactId;
    deleteModalInstance.show();
}

// Handle delete contact - Contact-ı sil
function handleDeleteContact() {
    if (!currentContactId) {
        alert("No contact selected");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Filmalisa/admin/pages/login.html";
        return;
    }

    console.log("Deleting contact ID:", currentContactId);

    fetch(`${CONTACT_URL}/${currentContactId}`, {
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
            console.log("Contact deleted:", resp);
            currentContactId = null;
            loadContacts();
            deleteModalInstance.hide();
        })
        .catch(error => {
            console.error("Error deleting contact:", error);
            alert("Error deleting contact");
        });
}
