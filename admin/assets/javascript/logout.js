logoutBtn.addEventListener(`click`, () => {
    const token = localStorage.getItem(`token`);

    if (token) {
        localStorage.removeItem(`token`)
        alert(`logged out`);
        window.location.href = `/Filmalisa/admin/pages/login.html`
        
    }else {
        auth()
        updateButton()
    }
})