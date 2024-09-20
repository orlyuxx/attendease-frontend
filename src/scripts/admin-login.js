async function handleSubmit(event) {
    console.log('handleSubmit called');
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://attendease-backend.test/api/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.token) {
            // Login successful
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'dashboard.html'; // Redirect to admin dashboard
        } else {
            // Login failed
            console.error('Login failed:', data);
            showToast(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast(error.message);
    }
}

// Add this function to create and show a toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Force a reflow to ensure the initial state is applied
    toast.offsetHeight;

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 10);
}

// Make sure this event listener is properly set up
document.getElementById('login-form').addEventListener('submit', handleSubmit);

// Check if user is already logged in
function checkAdminAuth() {
    const adminToken = localStorage.getItem('adminToken');
    const restrictedPages = ['dashboard.html', 'employees.html', 'departments.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (adminToken) {
        // User is logged in
        if (currentPage === 'index.html') {
            window.location.replace('dashboard.html');
        }
    } else {
        // User is not logged in
        if (restrictedPages.includes(currentPage)) {
            showToast('Please log in to access this page', 'error');
            window.location.replace('index.html');
        }
    }
}

// Run the check when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(username)) {
            showToast('The email field must be a valid email address.', 'error');
            return;
        }

        // Here you would typically send these credentials to your server for verification
        // For this example, we'll just check for a dummy username and password
        if (username === 'admin@example.com' && password === 'password123') {
            showToast('Login Successful!', 'success');
            // Here you would typically redirect the user or perform other actions
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
        } else {
            showToast('Invalid credentials', 'error');
        }
    });

    // Function to create and show a toast notification
    function showToast(message, type = 'success') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Force a reflow to ensure the initial state is applied
        toast.offsetHeight;

        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }, 10);
    }
});

