import { backendURL, showToast, showErrorToast } from "../utils/utils.js";

document.addEventListener('DOMContentLoaded', () => {
    const form_register = document.getElementById('form_register');

    if (form_register) {
        form_register.onsubmit = async (e) => {
            e.preventDefault();
            console.log('clicked');

            // Find the register button
            const registerButton = form_register.querySelector('button[type="submit"]');
            
            // Disable the register button
            if (registerButton) {
                registerButton.disabled = true;
            }

            try {
                // get values of form (input, textarea, select) put it as form data
                const formData = new FormData(form_register);

                // fetch API user register endpoint
                const response = await fetch(backendURL + '/api/user', { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                // get response if 200-299 status code
                if (response.ok) { 
                    const json = await response.json();
                    console.log(json);
                    form_register.reset();
                    
                    // Call the showToast function
                    showToast('Registration complete!');
                }

                // get response if 422 status code
                else if (response.status === 422) {
                    const json = await response.json();

                    // Call the showErrorToast function
                    showErrorToast(json.message); 
                }
            } 

            catch (error) {
                console.error('An error occurred:', error);
            } finally {
                // enable the register button again
                if (registerButton) {
                    registerButton.disabled = false;
                }
            }
        };
    } else {
        console.error('Form with id "form_register" not found');
    }
});
