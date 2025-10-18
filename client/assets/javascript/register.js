console.log("register started")

const guestEmail = localStorage.getItem("guest_email");
if(guestEmail) {
    document.querySelector(".form-email").value = guestEmail;
}