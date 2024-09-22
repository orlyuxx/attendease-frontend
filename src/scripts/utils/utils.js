const url = 'http://attendease-backend.test';

function showToast(message) {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = 'bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 mb-4'; // Added margin-bottom
    toast.innerText = message;

    // Append the toast to the form
    const form_register = document.getElementById('form_register');
    form_register.insertBefore(toast, form_register.firstChild); // Insert above the first child

    // Fade out the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toast.remove(); // Remove the toast from the DOM
        }, 300); // Wait for fade-out transition to complete
    }, 3000);
}

function showErrorToast(message) {
    // Create and show error toast notification
    const toast = document.createElement('div');
    toast.className = 'bg-red-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 mb-4'; // Added margin-bottom
    toast.innerText = message;

    // Append the toast to the form
    const form_register = document.getElementById('form_register');
    form_register.insertBefore(toast, form_register.firstChild); // Insert above the first child

    // Fade out the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toast.remove(); // Remove the toast from the DOM
        }, 300); // Wait for fade-out transition to complete
    }, 3000);
}

export { url, showToast, showErrorToast };