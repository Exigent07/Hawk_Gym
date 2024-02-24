const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// if (window.innerWidth <= 768) {
    
// }

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        gsap.to("#loading", { opacity: 0, duration: 2});
        gsap.to("#container", { opacity: 1});
        gsap.to(".bg", { backgroundSize: "cover", duration: 2});
    }, 1000);
});


signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("invalid")) {
    swal("Invalid!", "Wrong Username Or Password", "error").then(() => {
        window.location.href = "/";
    });
} else if (urlParams.has("success")) {
    swal({
        title: "Success!",
        text: "Registered Successfully",
        icon: "success",
        buttons: {
            login: {
                text: "Login",
                value: "login",
            },
        },
    }).then((value) => {
        window.location.href = "/";
    });
} else if (urlParams.has("failed")) {
    swal("Failed!", "Registration Failed", "error").then(() => {
        window.location.href = "/";
    });
}