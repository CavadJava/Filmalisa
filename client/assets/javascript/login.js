console.log("Login started");

// API URLS
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

const LOGIN_URL = `${API_BASE}/auth/login`;

const loginBtn = document.querySelector(".loginBtn");

if(loginBtn){
    loginBtn.addEventListener("click",handlerLogin);
}

// Handler login
function handlerLogin(){
    let emailEl = document.querySelector("#form-email");
    let passwordEl = document.querySelector("#form-password");

    validate(emailEl, passwordEl);

    fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailEl.value,
            password: passwordEl.value
        })
    })
    .then(response => response.json())
    .then(resp => {
        if(resp.result){
            localStorage.setItem("token", resp.data['tokens'].access_token);
            window.location.href = "/Filmalisa/client/pages/home.html";
        }else{
            alert("Wrong email or password");
        }
    }).catch(error=>{
        console.error("Error login:", error);
        alert("Error login");
    });

    return true;
}
function validate(emailEl,passwordEl){
    if(!(emailEl.value.trim().length>1)) {
        alert("Please enter your email and password");
        return false;
    }
    if(!passwordEl.value.trim().length>1){
        alert("Please enter your email and password");
        return false;
    }
}