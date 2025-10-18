const logoutBtn = document.querySelector(`.button.loginBtn`)
function updateButton () {
    const token =localStorage.getItem(`token`)
 logoutBtn.textContent = token ? `Logout` : `Login`
}
// todo no need
// updateButton()
logoutBtn.addEventListener(`click`, () => {
    const token = localStorage.getItem(`token`);

    if (token) {
        localStorage.removeItem(`token`)
        updateButton()
        alert(`logged out`);
        window.location.href = `/Filmalisa/admin/pages/login.html`
        
    }else {
        auth()
        updateButton()
    }
})