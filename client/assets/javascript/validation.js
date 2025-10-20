

function validate(emailEl, passwordEl) {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

 
  if (!email) {
    alert("Please enter your email");
    return false;
  }

 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return false;
  }

 
  if (!password) {
    alert("Please enter your password");
    return false;
  }

 
 

  return true;
}
