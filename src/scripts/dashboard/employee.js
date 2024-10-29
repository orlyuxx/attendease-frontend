import { backendURL } from "../utils/utils.js";

btn_logout.onclick = async () => {

    // Access Logout API endpoint
    const response = await fetch(backendURL + '/api/logout', { 
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
    });

    // get response if 200-299 status code
    if (response.ok) { 
        
        // clear token
        localStorage.clear();

        // redirect page
        window.location.pathname = "/pages/index.html"
    }
    // get response if 400 or 500 status code
    else {
        const json = await response.json();

        alert('json.message');
    }
};

let departments = {};
let allEmployees = [];
let filteredEmployees = [];
let currentPage = 1;
let entriesPerPage = 10; // You can adjust this value as needed

async function fetchDepartments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://attendease-backend.test/api/department', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Departments Data:', data);

        departments = data.reduce((acc, dept) => {
            acc[dept.department_id] = dept.department_name;
            return acc;
        }, {});
        console.log('Departments Object:', departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        showToast('Failed to fetch departments: ' + error.message, 'error');
    }
}

function getDepartmentName(departmentId) {
    return departments[departmentId] || 'N/A';
}

async function loadEmployees() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendURL}/api/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Employee data:', data);
        
        if (Array.isArray(data.data)) {
            allEmployees = data.data;
        } else if (Array.isArray(data)) {
            allEmployees = data;
        } else {
            throw new Error('Unexpected data structure received from server.');
        }

        filteredEmployees = allEmployees;
        displayEmployees();
    } catch (error) {
        console.error('Error loading employees:', error);
        showToast('Error fetching employees. Please try again.', 'error');
    }
}

function displayEmployees() {
    const tableBody = document.getElementById('employeesTableBody');
    const paginationInfo = document.getElementById('paginationInfo');
    
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, filteredEmployees.length);
    const displayedEmployees = filteredEmployees.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    displayedEmployees.forEach((employee, index) => {
        const row = document.createElement('tr');
        const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-100';
        const fullName = `${employee.firstname || ''} ${employee.lastname || ''}`.trim().toUpperCase() || 'N/A';
        const departmentName = getDepartmentName(employee.department_id);
        
        row.innerHTML = `
        <td class="w-1/6 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${startIndex + index + 1}</td>
        <td class="w-1/4 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">
            <a href="#" class="employee-name underline hover:underline hover:text-gray-700 font-semibold transition-colors duration-200 ease-in-out" data-id="${employee.id}">${fullName}</a>
            </td>
            <td class="w-1/6 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">00${employee.user_id || 'N/A'}</td>
            <td class="w-1/6 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${departmentName}</td>
            <td class="w-1/4 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${employee.email || 'N/A'}</td>
            <td class="w-1/6 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">
                <button class="edit-btn p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200" data-id="${employee.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button class="delete-btn p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200" data-id="${employee.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${filteredEmployees.length} entries`;

    updatePaginationButtons();
    addTableButtonListeners();
    addEmployeeNameListeners();
}

function updatePaginationButtons() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === Math.ceil(filteredEmployees.length / entriesPerPage);
}

function addTableButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const employeeId = button.getAttribute('data-id');
            console.log('Edit employee with ID:', employeeId);
            // TODO: Implement edit functionality
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const employeeId = button.getAttribute('data-id');
            console.log('Delete employee with ID:', employeeId);
            // TODO: Implement delete functionality
        });
    });
}

function addEmployeeNameListeners() {
    const employeeNames = document.querySelectorAll('.employee-name');
    employeeNames.forEach(name => {
        name.addEventListener('click', (e) => {
            e.preventDefault();
            const employeeId = e.target.getAttribute('data-id');
            console.log(`Clicked on employee with ID: ${employeeId}`);
            // TODO: Add navigation to employee records here
        });
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastContent = document.getElementById('toastContent');

    if (!toast || !toastContent) {
        console.error('Toast elements not found in the DOM');
        return;
    }

    toastContent.textContent = message;
    toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function setupEventListeners() {
    const entriesPerPageSelect = document.getElementById('entriesPerPage');
    const searchInput = document.getElementById('searchInput');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    entriesPerPageSelect.addEventListener('change', function() {
        entriesPerPage = parseInt(this.value);
        currentPage = 1;
        displayEmployees();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filteredEmployees = allEmployees.filter(employee => 
            employee.user_id.toLowerCase().includes(searchTerm) ||
            `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            getDepartmentName(employee.department_id).toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayEmployees();
    });

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayEmployees();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (currentPage < Math.ceil(filteredEmployees.length / entriesPerPage)) {
            currentPage++;
            displayEmployees();
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchDepartments();
        await loadEmployees();
        setupEventListeners();
        displayEmployees();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Error loading dashboard. Please refresh the page.', 'error');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const mainContent = document.getElementById('mainContent');
    const cancelAddEmployee = document.getElementById('cancelAddEmployee');
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    // Function to show the modal
    function showModal() {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
        mainContent.classList.add('blur-sm'); // Add blur to main content
    }

    // Function to hide the modal
    function hideModal() {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        mainContent.classList.remove('blur-sm'); // Remove blur from main content
    }

    // Show modal when Add Employee button is clicked
    addEmployeeBtn.addEventListener('click', showModal);

    // Hide modal when Cancel button is clicked
    if (cancelAddEmployee) {
        cancelAddEmployee.addEventListener('click', hideModal);
    }

    // Hide modal when clicking outside of it
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });

    // Handle form submission
    addEmployeeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addEmployeeForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${backendURL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to create employee');
            }

            const newEmployee = await response.json();
            console.log('Employee created:', newEmployee);
            
            // Close the modal and reset the form
            hideModal();
            addEmployeeForm.reset();
            
            // Refresh the employee list
            await loadEmployees();
            displayEmployees();

            showToast('Employee added successfully', 'success');

        } catch (error) {
            console.error('Error creating employee:', error);
            showToast('Failed to add employee', 'error');
        }
    });
});

// Example function to populate departments (you'll need to implement this)
async function populateDepartments() {
    const departmentSelect = document.getElementById('department_id');
    try {
        const response = await fetch(`${backendURL}/api/departments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        const departments = await response.json();
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            departmentSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Implement a similar function for shifts