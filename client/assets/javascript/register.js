console.log("register started")

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

const REGISTER_URL = `${API_BASE}/auth/signup`

const guestEmail = localStorage.getItem("guest_email");
if (guestEmail) {
    document.querySelector(".form-email").value = guestEmail;
}
const passwordEl = document.querySelector(".form-password");
const registerBtn = document.querySelector(".form-registerBtn");
if (registerBtn) {
    registerBtn.addEventListener("click", handleRegisterUser)
}

const eyeTogglePassword = document.querySelector(".eye-toggle");

if (eyeTogglePassword) {
    eyeTogglePassword.addEventListener("click", () => {
        const type =
            passwordEl.getAttribute("type") === "password" ? "text" : "password";
        passwordEl.setAttribute("type", type);
        eyeTogglePassword.classList.toggle("visible");
    });
}


// Register New User
function handleRegisterUser() {
    let fullName = document.querySelector(".form-fullName");
    let email = document.querySelector(".form-email");
    let password = document.querySelector(".form-password");

    validate(fullName, email, password);
    const token = localStorage.getItem("token");

    fetch(REGISTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            full_name: fullName.value,
            email: email.value,
            password: password.value
        })
    })
        .then(response => response.json())
        .then(resp => {
            window.location.href = "/Filmalisa/client/pages/login.html";
        }).catch(error => {
        console.error("Error register:", error);
        alert("Error register");
    });
}

// Register form validate
function validate(fullName, email, password) {
    if (fullName.value.trim() === "") {
        alert("Please enter your full name");
        return;
    }
    if (email.value.trim() === "") {
        alert("Please enter your email");
        return;
    }
    if (password.value.trim() === "") {
        alert("Please enter your password");
        return;
    }
}