/*
    Final project
    Christina Jackson and Christian Weersink
    INFT 2202-07
    Sign up javascript logic
*/

// Start listening after page is loaded
document.addEventListener("DOMContentLoaded", function() {
    const newPassword = document.getElementById("su_password");
    const confirmPass = document.getElementById('su_confirm_password');
    const showThePass = document.getElementById("showPassword");


    // On click, change the input type and text on button
    showThePass.addEventListener("click", function() {
        if (newPassword.type === "password") {
            newPassword.type = "text";
            confirmPass.type = "text";
            showThePass.textContent = "Hide Password";
        } else {
            newPassword.type = "password";
            confirmPass.type = "password";
            showThePass.textContent = "Show Password";
        }
    });


});

// Form submission
document.getElementById("sign-up").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById('su_email').value;
    const password = document.getElementById('su_password').value;
    const confirm = document.getElementById('su_confirm_password').value;
    const formMessage = document.getElementById("message");
    const username = document.getElementById("su_name").value;
    let isValid = true;
    let message = "";
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Form validation
    if (!emailRegex.test(email)) {
        isValid = false;
        message += "Email must be a valid format.<br>";
    }
    if(username.trim() == ""){
        isValid = false;
        message += "Username cannot be blank. <br>";
    }
    if (password.trim() == "") {
        isValid = false;
        message += "Password cannot be blank.<br>";
    }
    if (confirm.trim() == "") {
        isValid = false;
        message += "Confirm password cannot be blank.<br>";
    }
    if (confirm != password) {
        isValid = false;
        message += "Passwords must match.<br>";
    }
    if (password.length < 8) {
        isValid = false;
        message += "Password must be at least 8 characters.";
    }
    if (!isValid) {
        formMessage.innerHTML = message;
        formMessage.classList.add('error');
    }
    else { // information is valid
        try {
            const res = await fetch("/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (data.success) {
                formMessage.innerHTML = "Sign up successful. Please <a href='./sign-in'>sign in.<a>";
                formMessage.classList.add('success');
            } else {
                console.log("else");
                console.log(data.message);
                formMessage.innerHTML = data.message;
                formMessage.classList.add('error');
            }
        }
        catch (error) {
            console.log("error path");
            formMessage.innerHTML = data.message;
            formMessage.classList.add('error');
        }
    }
    
});
