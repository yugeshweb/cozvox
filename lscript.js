const loginForm = document.getElementById('login-form');
const createAccountForm = document.getElementById('create-account-form');
const loginContainer = document.getElementById('login-container');
const createAccountContainer = document.getElementById('create-account-container');
const errorMessageDiv = document.getElementById('error-message');
const createErrorMessageDiv = document.getElementById('create-error-message');

// Load users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Login functionality
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const existingUser  = users.find((user) => user.email === email);
    if (existingUser ) {
        if (existingUser .password === password) {
            console.log('Login successful');
            errorMessageDiv.innerText = 'Login Successful!';
            errorMessageDiv.style.color = 'green';

            // Optionally, redirect to another page after a short delay
            setTimeout(() => {
                window.location.href = 'indexlogin.html'; // Replace with your actual dashboard URL
            }, 2000);
        } else {
            errorMessageDiv.innerText = 'Invalid password';
            errorMessageDiv.style.color = 'red';
        }
    } else {
        errorMessageDiv.innerText = 'No account found with this email';
        errorMessageDiv.style.color = 'red';
    }
});

// Create account functionality
createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('create-email').value.trim();
    const password = document.getElementById('create-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Check if passwords match
    if (password !== confirmPassword) {
        createErrorMessageDiv.innerText = 'Passwords do not match';
        createErrorMessageDiv.style.color = 'red';
        return;
    }

    // Check if the email is already registered
    const existingUser  = users.find((user) => user.email === email);
    if (existingUser ) {
        createErrorMessageDiv.innerText = 'Email ID is already registered';
        createErrorMessageDiv.style.color = 'red';
    } else {
        // Create a new user account
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Account created successfully');
        createErrorMessageDiv.innerText = '';
        createAccountContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
});

// Toggle between login and create account forms
document.getElementById('show-create-account').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    createAccountContainer.style.display = 'block';
    errorMessageDiv.innerText = '';
});

document.getElementById('show-login').addEventListener('click', () => {
    createAccountContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    createErrorMessageDiv.innerText = '';
});

// Google Sign-In functionality (if needed)
function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
        });
    });
}

function onSignIn(googleUser ) {
    var profile = googleUser .getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    // Handle the sign-in process and store user information as needed
}

