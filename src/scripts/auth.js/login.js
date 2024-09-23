import { backendURL } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const form_login = document.getElementById('form_login');
    const loginImage = document.getElementById('login-image');

    // Add event listener to fade in the image once it's loaded
    loginImage.onload = () => {
        loginImage.classList.add('image-loaded');
    };

    // Trigger the load event for already cached images
    if (loginImage.complete) {
        loginImage.onload();
    }

    if (form_login) {
        form_login.onsubmit = async (e) => {
            e.preventDefault();
            console.log('clicked login');

            // Find the login button
            const loginButton = form_login.querySelector('button[type="submit"]');

            // Disable the login button and add spinner
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.innerHTML = `<div class="spinner"></div> Logging in...`; // Add spinner and change text
            }

            try {
                // Get values of form (input, textarea, select) put it as form data
                const formData = new FormData(form_login);

                // Fetch API user login endpoint
                const response = await fetch(backendURL + '/api/login', { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                // If the response is ok (status code 200-299)
                if (response.ok) {
                    const json = await response.json();
                    console.log(json);
                    
                    localStorage.setItem('token', json.token);

                    form_login.reset();

                    showToast('Login successful!', 'success'); // Success toast

                    // Add a delay before redirecting to dashboard
                    setTimeout(() => {
                        window.location.pathname = "/pages/dashboard.html";
                    }, 1000); // 2 seconds delay before redirecting
                }

                // Handle validation error (status code 422)
                else if (response.status === 422) {
                    const json = await response.json();
                    showToast('Login failed: ' + json.message, 'error'); // Error toast
                }
            } catch (error) {
                console.error('An error occurred:', error);
                showToast('An unexpected error occurred.', 'error'); // Error toast
            } finally {
                // Re-enable the login button and remove spinner after request is done
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.innerHTML = `Login`; // Reset button text
                }
            }
        };
    } else {
        console.error('Form with id "form_login" not found');
    }
});

// Function to create and show toast notifications
function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // Add type class for styling
    toast.innerText = message;

    // Append the toast to the container
    toastContainer.insertBefore(toast, toastContainer.firstChild);

    // Remove the toast after a delay
    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 3000); // Adjust duration as needed
}
