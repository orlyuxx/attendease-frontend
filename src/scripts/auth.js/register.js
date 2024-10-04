import { backendURL, showToast, showErrorToast } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const form_register = document.getElementById('form_register');

    if (form_register) {
        form_register.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Form submitted');

            const registerButton = form_register.querySelector('button[type="submit"]');
            if (registerButton) {
                registerButton.disabled = true;
            }

            try {
                const formData = new FormData(form_register);

                const response = await fetch(`${backendURL}/api/user`, { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData)),
                });

                console.log('Response status:', response.status);
                const responseData = await response.json();
                console.log('Response data:', responseData);

                if (response.ok) { 
                    form_register.reset();
                    showToast('Registration complete!');
                } else if (response.status === 422) {
                    showErrorToast(responseData.message || 'Validation error occurred'); 
                } else {
                    showErrorToast(responseData.message || 'An error occurred');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                showErrorToast('An error occurred. Please try again.');
            } finally {
                if (registerButton) {
                    registerButton.disabled = false;
                }
            }
        };
    } else {
        console.error('Form with id "form_register" not found');
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
