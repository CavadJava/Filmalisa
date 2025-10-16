let url = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users";
let userData = [];
let currentPage = 1;
let itemsPerPage = 10;

function userList(){
    try {
        let token = localStorage.getItem("token");
        if(token==null || token.length<10){
            location.href="/Filmalisa/admin/pages/login.html";
            return;
        }
        let options = {
            method : 'GET',
            headers : {
                'Authorization':"Bearer ".concat(token),
                'Accept-Language':'AZ'
            }
        }
        return (fetch(url, options)).then(response => response.json()).then(data => {
            console.log(data);
            userData = data['data'];
            console.log(userData)
            displayPage(1);
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

function setPagination(){
    let totalPages = Math.ceil(userData.length / itemsPerPage);

    if(totalPages > 0) {
        let result = `<ul class="pagination">`;

        // Previous button
        result += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}" onclick="${currentPage > 1 ? 'displayPage(' + (currentPage - 1) + ')' : ''}">
            <a class="page-link"">Previous</a>
        </li>`;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            result += `<li class="page-item ${i === currentPage ? 'active' : ''}" onclick="displayPage(${i})">
                <a class="page-link"">${i}</a>
            </li>`;
        }

        // Next button
        result += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}" onclick="${currentPage < totalPages ? 'displayPage(' + (currentPage + 1) + ')' : ''}">
            <a class="page-link"">Next</a>
        </li>`;

        result += `</ul>`;
        document.querySelector(".pagination").innerHTML = result;
    }
}

userList()