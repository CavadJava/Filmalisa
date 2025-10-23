

document.addEventListener("DOMContentLoaded", async () => {

  const imageInput = document.querySelector('input[placeholder="profile image url"]');
  const fullnameInput = document.querySelector('input[placeholder="fullname"]');
  const emailInput = document.querySelector('input[placeholder="email"]');
  const passwordInput = document.querySelector('input[placeholder="password"]');
  const profilePhoto = document.querySelector('.account-icon img');
  const saveButton = document.querySelector('.form-accountBtn');
   const togglePassword = document.getElementById("eye");

    emailInput.disabled = true;
  emailInput.style.opacity = "0.6";



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

  });
