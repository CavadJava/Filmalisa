const signInBtn = document.getElementById("signInBtn");
const profileMenu = document.getElementById("profileMenu");
const profileIcon = document.getElementById("profileIcon");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");
const userImage = document.getElementById("userImage");
const username = document.getElementById("username");

// localStorage-dən token və şəkil məlumatı
const token = localStorage.getItem("token");
const userPhoto = localStorage.getItem("userPhoto"); 
const userName = localStorage.getItem("userName");   

// Token yoxlanışı
if (token) {
  signInBtn.style.display = "none";
  profileMenu.style.display = "block";

  // istifadəçi şəkli varsa onu göstər
  if (userPhoto) {
    userImage.src = userPhoto;
  } else {
    userImage.src = "./assets/icons/user.svg"; // default icon
  }

  // ad göstər
  username.textContent = userName || "User";
} else {
  signInBtn.style.display = "block";
  profileMenu.style.display = "none";
}

// Profil ikonuna klik → menyunu aç / bağla
profileIcon.addEventListener("click", () => {
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
