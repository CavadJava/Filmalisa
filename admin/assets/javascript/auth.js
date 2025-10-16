let authUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login";
console.log("auth started")

class Authenticate {
    email;
    password;
    url;
    error = true;
    successResponse = {};
    errorResponse = {};
    constructor(email,password) {
        this.email = email;
        this.password = password;
        this.url = authUrl;
    }
    async login (){
        try {
            let requestBody = {
                email:this.email,
                password:this.password
            };
            let options = {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(requestBody)
            }
            return (await fetch(this.url, options)).json();
        } catch (error) {
            console.log(error);
        }
    }

}

function auth(){
    console.log("auth started")
    let email = document.querySelector(".email-input").value;
    let password = document.querySelector(".password-input").value;

    let api = new Authenticate(email,password);
    api.login().then(response=>{
        if(response.result){
            console.log("auth success")
            api.successResponse = response;
            api.error = false;
            let token = window.localStorage.getItem("token");
            if(token != null){
                window.localStorage.removeItem("token");
            }
            window.localStorage.setItem("token", response['data'].tokens['access_token']);
            location.href="/Filmalisa/admin/pages/dashboard.html";
        }else{
            console.log("auth error")
            api.errorResponse = response;
            api.error = true;
            document.querySelector("#form-email").style.border = "1px solid red";
            document.querySelector("#form-password").style.border = "1px solid red";
            location.href="/Filmalisa/admin/pages/login.html";
            return;
        }
        console.log(response);
    }).catch(error=>{
        console.log(error);
    });
}
function reset(){
    document.querySelector("#form-email").removeAttribute("style")
    document.querySelector("#form-password").removeAttribute("style")
}