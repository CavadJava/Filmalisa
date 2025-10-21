console.log("Index page started")

// API URLs
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const CONTACT_URL = `${BASE_URL}/contact`;

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
// Setup event listener
const sendContacts = document.querySelector(".contact-btn");
if(sendContacts){
    sendContacts.addEventListener("click", handlerContact);
}

// Handler Send Contact
function handlerContact(){
    let fullName = document.querySelector("#exampleFormControlInput1");
    let email = document.querySelector("#exampleFormControlInput2");
    let reason = document.querySelector("#exampleFormControlTextarea1");

    validation(fullName, email, reason);

    const body = {
        "full_name":fullName.value.trim(),
        "email":email.value.trim(),
        "reason":reason.value.trim()
    }
    fetch(CONTACT_URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body),
    }).then(response => response.json())
    .then(resp => {
        if (!resp.result) {
            throw new Error("Network response was not ok");
        }
        alert("Your contact information has been sent")
    }).catch(error=>{
        console.error("Error creating contact:", error);
        alert("Error creating contact");
    });
}

// Validation
function validation(fullName, email, reason){

}