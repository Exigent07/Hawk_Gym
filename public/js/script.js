const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const signUpExtra = document.getElementById('signUpExtra');
const signInExtra = document.getElementById('signInExtra');
const container = document.getElementById('container');
const signUp = document.getElementsByClassName('sign-up-container')[0];
const signIn = document.getElementsByClassName('sign-in-container')[0];

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

signUpExtra.addEventListener('click', () => {
	signIn.style.display = "none";
	signUp.style.display = "inline-block";
	signUp.style.opacity = 1;
});

signInExtra.addEventListener('click', () => {
	signUp.style.display = "none";
	signIn.style.display = "inline-block";
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
} else if (urlParams.has("exists")) {
    swal("Exists!", "Useraname or Email already exists!", "warning").then(() => {
        window.location.href = "/";
    });
}