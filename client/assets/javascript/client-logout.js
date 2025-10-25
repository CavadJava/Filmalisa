const logoutBtn = document.querySelector(".loginBtn")
logoutBtn.addEventListener(`click`, () => {
    const token = localStorage.getItem(`token`);

    if (token) {
        localStorage.setItem(`token`,token)
        localStorage.setItem(`role`,'admin')
        localStorage.setItem(`role`,'client')
        window.location.href = `/Filmalisa/index.html`
    }
})