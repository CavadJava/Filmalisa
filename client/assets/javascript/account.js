console.log("Account started");
// document.addEventListener("DOMContentLoaded", async () => {

const defaultProfileImg = "/Filmalisa/client/assets/images/teacher.svg";
const imageInput = document.querySelector('input[placeholder="profile image url"]');
const fullnameInput = document.querySelector('input[placeholder="fullname"]');
const emailInput = document.querySelector('input[placeholder="email"]');
const passwordInput = document.querySelector('input[placeholder="password"]');
const profilePhoto = document.querySelector('.account-icon img');
const saveButton = document.querySelector('.form-accountBtn');
const togglePassword = document.getElementById("eye");

// Load Profile
loadProfile();

function loadProfile(){
    fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(resp => {
        if (resp.data) {
            document.querySelector(".image-frame img").setAttribute("src",
                !resp.data['img_url'] ? resp.data['img_url'] : defaultProfileImg);
            imageInput.value = !resp.data['img_url'] ? resp.data['img_url'] : defaultProfileImg;
            fullnameInput.value = resp.data['full_name'];
            emailInput.value = resp.data['email'];
        }
        console.log("Profile loaded:", resp);
    })
    .catch(error => {
        console.error("Error loading profile:", error);
    });
}

imageInput.addEventListener("keypress", (e) => {
    imageInput.style.color = "#475069"
    if (imageInput.value.trim().length > 0) {
        document.querySelector("figure img").backgroundImage = imageInput.value;
    } else {
        document.querySelector("figure img").setAttribute("src", '/Filmalisa/client/assets/images/teacher.svg');
    }
})

if (fullnameInput) {
    fullnameInput.addEventListener("keypress", (e) => {
        fullnameInput.style.color = "#475069"
    })
}

if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
        passwordInput.style.color = "#475069"
    })
}

emailInput.disabled = true;
emailInput.style.backgroundColor = "#1E1E1E";
emailInput.style.color = "white";


const saved = JSON.parse(localStorage.getItem("accountData"));
if (saved) {
    if (saved.imageUrl) profilePhoto.src = saved.imageUrl;
    if (saved.full_name) fullnameInput.value = saved.full_name;
    if (saved.email) emailInput.value = saved.email;
    if (saved.password) passwordInput.value = saved.password;
}


imageInput.addEventListener("input", () => {
    const url = imageInput.value.trim();
    if (url && url.startsWith("http")) {
        profilePhoto.src = url;
    }
});
if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const type =
            passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.classList.toggle("visible");
    });
}


// Handle "Save" button click
saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("❌ No token found! Please log in first.");
        return;
    }

    const data = {
        full_name: fullnameInput.value.trim(),
        email: emailInput.value.trim(),
        img_url: imageInput.value.trim(),
        password: passwordInput.value.trim(),
    };

    localStorage.setItem("accountData", JSON.stringify(data))


    // Send PUT request to API
    try {
        const response = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
            method: "PUT",
            headers: {
                "Accept-Language": "en", // or your preferred language
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update profile");
        }

        const result = await response.json();
        console.log("✅ Profile updated:", result);
        alert("✅ Profile updated successfully!");

    } catch (error) {
        console.error("❌ Error updating profile:", error);
        alert("❌ Error updating profile: " + error.message);
    }
});

// });
