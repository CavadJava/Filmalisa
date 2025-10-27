console.log("User started");

let userData = [];
let currentPage = 1;
let itemsPerPage = 5;


const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const USERS_URL = `${API_BASE}/admin/users`;

// Initialize - Load Users on page load
userList();

// Auth
setTimeout(auth,3000)

const btnLogout = document.querySelector('.btnLogout');
if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}
// Handle logout
function logout(){
    localStorage.removeItem(`token`)
    localStorage.removeItem(`role`)
    window.location.href = "/Filmalisa/admin/pages/login.html";
}

// Handle Auth before login
function auth(){
    if (localStorage.getItem("role") !== "admin") {
        localStorage.removeItem(`token`)
        localStorage.removeItem(`role`)
        localStorage.removeItem(`accountData`)
        window.location.href = "/Filmalisa/admin/pages/login.html";
    }
}

function userList(){
    const token = localStorage.getItem("token");
    try {
        if (!token) {
            console.error("No token found");
            window.location.href = "/Filmalisa/admin/pages/login.html";
            return;
        }
        fetch(USERS_URL, {
            method : 'GET',
            headers : {
                'Authorization':"Bearer ".concat(token),
                'Accept-Language':'AZ'
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            userData = data['data'];
            console.log(userData)
            displayPage(1);
        }).catch(error =>{
            console.error("Error loading users", error);
        });

    } catch (error) {
        console.log(error);
    }
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

    data.forEach((ud, index) => {
        let order = startIndex + index + 1;
        let row = `
          <tr>
            <td id="userId" style="display: none">${ud.id}</td>
            <td>${order}</td>
            <td>${ud.full_name}</td>
            <td>${ud.email}</td>
          </tr>
        `;
        result += row;
    });
    document.querySelector(".page-table tbody").innerHTML = result;
}

// function setPagination(){
//     let totalPages = Math.ceil(userData.length / itemsPerPage);

//     if(totalPages > 0) {
//         let result = `<ul class="pagination">`;

//         // Page numbers
//         for (let i = 1; i <= totalPages; i++) {
//             result += `<li class="page-item ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">
//                 <a class="page-link"">${i}</a>
//             </li>`;
//         }

//         result += `</ul>`;
//         document.querySelector(".pagination").innerHTML = result;
//     }
    
// }
function setPagination() {
    const totalPages = Math.ceil(userData.length / itemsPerPage);
    const maxVisiblePages = 3; // eyni anda görünən səhifə sayı
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
    const totalPages = Math.ceil(userData.length / itemsPerPage);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    displayPage(currentPage);
}
