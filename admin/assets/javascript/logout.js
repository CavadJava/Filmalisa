const logoutBtn = document.querySelector(".loginBtn")
logoutBtn.addEventListener(`click`, () => {
    const token = localStorage.getItem(`token`);

    if (token) {
        window.location.href = `/Filmalisa/admin/pages/dashboard.html`
        localStorage.setItem(`token`,token)
        localStorage.setItem(`role`,'admin')
    }
})