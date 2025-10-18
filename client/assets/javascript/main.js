console.log("main started")

function main(){
    let emailInput = document.querySelector("#email-lan-page");
    if(emailInput){
        window.localStorage.setItem("guest_email",emailInput.value);
        window.location.href = "client/pages/register.html"
    }else{
        emailInput.style = "border: 1px solid red;"
        window.location.href = "client/pages/index.html"
    }
}