import { backendURL, showToast, showErrorToast } from "../utils/utils.js";

const btn_logout = document.getElementById("btn_logout")
const entriesPerPageSelect = document.getElementById("entriesPerPage")
const prevPageBtn = document.getElementById("prevPage")
const nextPageBtn = document.getElementById("nextPage")
const paginationInfo = document.getElementById("paginationInfo")
const searchInput = document.getElementById("searchInput")

let currentPage = 1;
let entriesPerPage = parseInt(entriesPerPageSelect.value);

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function setCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    const today = new Date();
    currentDateElement.textContent = formatDate(today);
}

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

// Dummy data for the attendance table
const dummyAttendanceData = [
    {
        no: 1,
        date: "10/04/24",
        name: "John Doe",
        department: "IT",
        timeIn: "08:00 AM",
        breakIn: "12:00 PM",
        breakOut: "01:00 PM",
        timeOut: "05:00 PM"
    },
    {
        no: 2,
        date: "10/04/24",
        name: "Jane Smith",
        department: "HR",
        timeIn: "08:15 AM",
        breakIn: "12:30 PM",
        breakOut: "01:30 PM",
        timeOut: "05:15 PM"
    },
    {
        no: 3,
        date: "10/04/24",
        name: "Mike Johnson",
        department: "Marketing",
        timeIn: "08:30 AM",
        breakIn: "12:15 PM",
        breakOut: "01:15 PM",
        timeOut: "05:30 PM"
    },
    {
        no: 4,
        date: "10/04/24",
        name: "Emily Brown",
        department: "Finance",
        timeIn: "08:45 AM",
        breakIn: "12:45 PM",
        breakOut: "01:45 PM",
        timeOut: "05:45 PM"
    },
    {
        no: 5,
        date: "10/04/24",
        name: "David Lee",
        department: "Operations",
        timeIn: "09:00 AM",
        breakIn: "01:00 PM",
        breakOut: "02:00 PM",
        timeOut: "06:00 PM"
    },
    {
        no: 6,
        date: "10/04/24", // Make sure this is in the correct format
        name: "Sarah Wilson",
        department: "Sales",
        timeIn: "08:30 AM",
        breakIn: "12:30 PM",
        breakOut: "01:30 PM",
        timeOut: "05:30 PM"
    },
    {
        no: 7,
        date: "10/04/24",
        name: "Tom Harris",
        department: "IT",
        timeIn: "09:15 AM",
        breakIn: "01:15 PM",
        breakOut: "02:15 PM",
        timeOut: "06:15 PM"
    },
    {
        no: 8,
        date: "10/04/24",
        name: "Emma Taylor",
        department: "HR",
        timeIn: "08:45 AM",
        breakIn: "12:45 PM",
        breakOut: "01:45 PM",
        timeOut: "05:45 PM"
    },
    {
        no: 9,
        date: "10/04/24",
        name: "Chris Evans",
        department: "Marketing",
        timeIn: "09:30 AM",
        breakIn: "01:30 PM",
        breakOut: "02:30 PM",
        timeOut: "06:30 PM"
    },
    {
        no: 10,
        date: "10/04/24",
        name: "Olivia Martin",
        department: "Finance",
        timeIn: "08:00 AM",
        breakIn: "12:00 PM",
        breakOut: "01:00 PM",
        timeOut: "05:00 PM"
    },
    {
        no: 11,
        date: "10/04/24",
        name: "Daniel White",
        department: "Operations",
        timeIn: "08:30 AM",
        breakIn: "12:30 PM",
        breakOut: "01:30 PM",
        timeOut: "05:30 PM"
    },
    {
        no: 12,
        date: "10/04/24",
        name: "Sophia Chen",
        department: "Sales",
        timeIn: "09:00 AM",
        breakIn: "01:00 PM",
        breakOut: "02:00 PM",
        timeOut: "06:00 PM"
    },
    {
        no: 13,
        date: "10/04/24",
        name: "Ryan Patel",
        department: "IT",
        timeIn: "08:45 AM",
        breakIn: "12:45 PM",
        breakOut: "01:45 PM",
        timeOut: "05:45 PM"
    },
    {
        no: 14,
        date: "10/04/24",
        name: "Isabella Kim",
        department: "HR",
        timeIn: "09:15 AM",
        breakIn: "01:15 PM",
        breakOut: "02:15 PM",
        timeOut: "06:15 PM"
    },
    {
        no: 15,
        date: "10/04/24",
        name: "Alex Johnson",
        department: "Marketing",
        timeIn: "08:00 AM",
        breakIn: "12:00 PM",
        breakOut: "01:00 PM",
        timeOut: "05:00 PM"
    },
    {
        no: 16,
        date: "10/04/24",
        name: "Grace Liu",
        department: "Finance",
        timeIn: "08:30 AM",
        breakIn: "12:30 PM",
        breakOut: "01:30 PM",
        timeOut: "05:30 PM"
    },
    {
        no: 17,
        date: "10/04/24",
        name: "Nathan Brown",
        department: "Operations",
        timeIn: "09:00 AM",
        breakIn: "01:00 PM",
        breakOut: "02:00 PM",
        timeOut: "06:00 PM"
    },
    {
        no: 18,
        date: "10/04/24",
        name: "Ava Garcia",
        department: "Sales",
        timeIn: "08:45 AM",
        breakIn: "12:45 PM",
        breakOut: "01:45 PM",
        timeOut: "05:45 PM"
    },
    {
        no: 19,
        date: "10/04/24",
        name: "Ethan Wright",
        department: "IT",
        timeIn: "09:30 AM",
        breakIn: "01:30 PM",
        breakOut: "02:30 PM",
        timeOut: "06:30 PM"
    },
    {
        no: 20,
        date: "10/04/24",
        name: "Mia Thompson",
        department: "HR",
        timeIn: "08:15 AM",
        breakIn: "12:15 PM",
        breakOut: "01:15 PM",
        timeOut: "05:15 PM"
    }
];

function populateAttendanceTable(data) {
    console.log("Populating table with", data.length, "rows");
    const tableBody = document.getElementById('employeesTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach((entry, index) => {
        const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-100';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="w-1/12 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.no}</td>
            <td class="w-2/12 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${formatDateForDisplay(entry.date)}</td>
            <td class="w-3/12 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.name}</td>
            <td class="w-2/12 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.department}</td>
            <td class="w-1/16 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.timeIn}</td>
            <td class="w-1/16 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.breakIn}</td>
            <td class="w-1/16 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.breakOut}</td>
            <td class="w-1/16 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">${entry.timeOut}</td>
            <td class="w-2/12 text-xs text-gray-500 font-bold py-3 px-4 border-b border-r-2 border-white ${bgColor}">
                <button class="text-blue-500 hover:text-blue-700 mr-2 edit-btn" data-id="${entry.no}">Edit</button>
                <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${entry.no}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updatePaginationInfo(filteredData) {
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const start = (currentPage - 1) * entriesPerPage + 1;
    const end = Math.min(start + entriesPerPage - 1, totalEntries);

    paginationInfo.textContent = `Showing ${start} to ${end} of ${totalEntries} entries`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function filterAndDisplayAttendance() {
    console.log("Total entries:", dummyAttendanceData.length);
    const searchTerm = searchInput.value.toLowerCase();
    let filteredData = dummyAttendanceData;

    if (searchTerm) {
        filteredData = dummyAttendanceData.filter(entry =>
            entry.name.toLowerCase().includes(searchTerm) ||
            entry.department.toLowerCase().includes(searchTerm) ||
            (entry.date && entry.date.toLowerCase().includes(searchTerm))
        );
    }

    console.log("Filtered entries:", filteredData.length);

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);

    console.log("Page data entries:", pageData.length);

    populateAttendanceTable(pageData);
    updatePaginationInfo(filteredData);

    // Update pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

entriesPerPageSelect.addEventListener("change", () => {
    entriesPerPage = parseInt(entriesPerPageSelect.value);
    currentPage = 1;
    filterAndDisplayAttendance();
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        filterAndDisplayAttendance();
    }
});

nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(dummyAttendanceData.length / entriesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        filterAndDisplayAttendance();
    }
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    filterAndDisplayAttendance();
});

// Initial population of the table
document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    filterAndDisplayAttendance();
});

// Add a new function to format the date for display
function formatDateForDisplay(dateString) {
    if (!dateString) return ''; // Return empty string if dateString is undefined or null
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString; // Return original string if it's not in the expected format
    const [month, day, year] = parts;
    return `${month}/${day}/${year}`; // This will keep the MM/DD/YY format
}