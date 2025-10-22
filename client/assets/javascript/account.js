document.addEventListener("DOMContentLoaded", () => {

    const imageInput = document.querySelector('input[placeholder="profile image url"]');
    const fullnameInput = document.querySelector('input[placeholder="fullname"]');
    const emailInput = document.querySelector('input[placeholder="email"]');
    const passwordInput = document.querySelector('input[placeholder="password"]');
    const profilePhoto = document.querySelector('.account-icon img');
    const saveButton = document.querySelector('.form-accountBtn');



    const saved = JSON.parse(localStorage.getItem("accountData"));
    if (saved) {
        if (saved.imageUrl) profilePhoto.src = saved.imageUrl;
        if (saved.fullname) fullnameInput.value = saved.fullname;
        if (saved.email) emailInput.value = saved.email;
        if (saved.password) passwordInput.value = saved.password;
    }


    imageInput.addEventListener("input", () => {
        const url = imageInput.value.trim();
        if (url && url.startsWith("http")) {
            profilePhoto.src = url;
        }
    });



    saveButton.addEventListener("click", (e) => {
        e.preventDefault();

        const data = {
            imageUrl: imageInput.value.trim(),
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        // burda profil api cagirmag lazimdir
        localStorage.setItem("accountData", JSON.stringify(data));
        alert("Account saved successfully!");
    });
});