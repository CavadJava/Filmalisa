console.log("Index page started")

// API URLs
const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const CONTACT_URL = `${BASE_URL}/contact`;

const signInBtn = document.querySelector(".signInBtn");
const profileMenu = document.getElementById("profileMenu");
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.querySelector(".logoutBtn");
const userImage = document.getElementById("userImage");
const username = document.getElementById("username");

const token = localStorage.getItem("token");
const userPhoto = localStorage.getItem("userPhoto");
const userName = localStorage.getItem("userName");

logoutBtn.addEventListener(`click`, () => {
    const token = localStorage.getItem(`token`);

    if (token) {
        localStorage.setItem(`token`,token)
        localStorage.setItem(`role`,'admin')
        localStorage.setItem(`role`,'client')
        window.location.href = `/Filmalisa/index.html`
    }
})

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

// Token yoxlanışı
if (token) {
    signInBtn.style.display = "none";
    profileMenu.style.display = "block";

    // istifadəçi şəkli varsa onu göstər
    if (userPhoto) {
        userImage.src = userPhoto;
    } else {
        userImage.src = "/client/assets/images/profile.png"; // default icon
    }

    // ad göstər
    username.textContent = userName || "User";
} else {
    signInBtn.style.display = "block";
    profileMenu.style.display = "none";
}

// Profil ikonuna klik → menyunu aç / bağla
// profileIcon.addEventListener("click", () => {
//     dropdownMenu.style.display === "block" ? "none" : "block";
// });
profileIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // kənara klikdə bağlanmasın deyə
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
});


// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("userName");
    window.location.reload();
});

// Kənara klik → menyu bağlansın
window.addEventListener("click", (e) => {
    if (!profileMenu.contains(e.target)) {
        dropdownMenu.style.display = "none";
    }
});