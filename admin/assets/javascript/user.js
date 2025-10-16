let url = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users";
let userData = []
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
            setUserList(userData)
        });

    } catch (error) {
        console.log(error);
    }
    function setUserList(userData){
        let result = "";
        let order = 1;
        userData.map(ud=>{
            let row = `
              <tr>
                <td id="userId" style="display: none">${ud.id}</td>
                <td>${order++}</td>
                <td>${ud.full_name}</td>
                <td>${ud.email}</td>
              </tr>
        `;
            result+=row
        });
        document.querySelector(".page-table tbody").innerHTML = result;
    }

}
userList()