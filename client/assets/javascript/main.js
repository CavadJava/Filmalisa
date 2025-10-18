console.log("main started")

function main(){
    let emailInput = document.querySelector("#email-lan-page");
    if(emailInput.value!=null && emailInput.value.length>1){
        window.localStorage.setItem("guest_email",emailInput.value);
        window.location.href = "client/pages/register.html"
    }else{
        emailInput.style = "border: 1px solid red;"
        window.location.href = "index.html"
    }
}