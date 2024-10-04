import { backendURL, showToast, showErrorToast } from "../utils/utils.js";

const btn_logout = document.getElementById("btn_logout")

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
 
let employeeAttendanceChart;

function generateDataKey(year, month) {
    return `attendanceData_${year}_${month}`;
}

function saveData(year, month, data) {
    localStorage.setItem(generateDataKey(year, month), JSON.stringify(data));
}

function loadData(year, month) {
    const savedData = localStorage.getItem(generateDataKey(year, month));
    return savedData ? JSON.parse(savedData) : null;
}

function clearAllData() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('attendanceData_')) {
            localStorage.removeItem(key);
        }
    });
}

async function fetchMonthlyData(year, month) {
    const storageKey = `attendanceData_${year}_${month}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
        return JSON.parse(storedData);
    }

    const totalEmployees = await fetchTotalEmployees();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const daysInMonth = getDaysInMonth(year, month);
    const labels = [...Array(daysInMonth).keys()].map(i => i + 1);

    // Only generate data for the current month
    if (year === currentYear && month === currentMonth) {
        const presentEmployees = [];
        const absentEmployees = [];
        const employeesOnLeave = [];

        for (let i = 0; i < daysInMonth; i++) {
            if (i < currentDay) {
                let present, onLeave, absent;
                if (Math.random() < 0.2) {
                    onLeave = Math.floor(Math.random() * (totalEmployees * 0.05)); // Max 5% on leave
                    absent = Math.floor(Math.random() * (totalEmployees * 0.1)); // Max 10% absent
                    present = totalEmployees - onLeave - absent;
                } else {
                    onLeave = 0;
                    if (Math.random() < 0.3) {
                        present = totalEmployees;
                        absent = 0;
                    } else {
                        absent = Math.floor(Math.random() * (totalEmployees * 0.05)); // Max 5% absent
                        present = totalEmployees - absent;
                    }
                }
                presentEmployees.push(present);
                absentEmployees.push(absent);
                employeesOnLeave.push(onLeave);
            } else {
                presentEmployees.push(null);
                absentEmployees.push(null);
                employeesOnLeave.push(null);
            }
        }

        const data = { labels, presentEmployees, absentEmployees, employeesOnLeave };
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
    } else {
        // For other months, return empty data
        const emptyData = {
            labels,
            presentEmployees: Array(daysInMonth).fill(null),
            absentEmployees: Array(daysInMonth).fill(null),
            employeesOnLeave: Array(daysInMonth).fill(null)
        };
        localStorage.setItem(storageKey, JSON.stringify(emptyData));
        return emptyData;
    }
}

function clearPreviousMonthsData(currentYear, currentMonth) {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('attendanceData_')) {
            const [_, year, month] = key.split('_');
            if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                localStorage.removeItem(key);
            }
        }
    });
}

async function updateChart() {
    const selectedYear = parseInt(document.getElementById('yearSelector').value);
    const selectedMonth = parseInt(document.getElementById('monthSelector').value);

    const data = await fetchMonthlyData(selectedYear, selectedMonth);
    const totalEmployees = await fetchTotalEmployees();

    employeeAttendanceChart.data.labels = data.labels;
    employeeAttendanceChart.data.datasets[0].data = data.presentEmployees;
    employeeAttendanceChart.data.datasets[1].data = data.absentEmployees;
    employeeAttendanceChart.data.datasets[2].data = data.employeesOnLeave;
    
    employeeAttendanceChart.options.scales.y.max = totalEmployees;
    
    employeeAttendanceChart.update();

    console.log('Chart updated for:', { year: selectedYear, month: months[selectedMonth] });
}

// Add this at the top of your file with other global variables
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

document.addEventListener('DOMContentLoaded', async function() {
    await initializeMonthlyData();

    const ctx = document.getElementById('employeeAttendanceChart').getContext('2d');
    
    // Create month and year selectors
    const monthSelector = document.createElement('select');
    monthSelector.id = 'monthSelector';
    const yearSelector = document.createElement('select');
    yearSelector.id = 'yearSelector';

    // Populate month selector
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelector.appendChild(option);
    });

    // Populate year selector (current year and next year)
    const currentYear = new Date().getFullYear();
    [currentYear - 1, currentYear, currentYear + 1].forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    });

    // Set default values to current month and year
    const today = new Date();
    monthSelector.value = today.getMonth();
    yearSelector.value = today.getFullYear();

    // Replace the existing selector with new month and year selectors
    const selectorContainer = document.querySelector('.flex.space-x-4');
    selectorContainer.innerHTML = '';
    selectorContainer.appendChild(monthSelector);
    selectorContainer.appendChild(yearSelector);

    employeeAttendanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Present Employees',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 10  // Add this line to increase bar thickness
                },
                {
                    label: 'Absent Employees',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barThickness: 10  // Add this line to increase bar thickness
                },
                {
                    label: 'Employees on Leave',
                    data: [],
                    backgroundColor: 'rgba(255, 206, 86, 0.8)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    barThickness: 10  // Add this line to increase bar thickness
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days of the Month',
                        font: {
                            size: 14
                        }
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Employees',
                        font: {
                            size: 14
                        }
                    },
                    suggestedMax: 140,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Monthly Employee Attendance',
                    font: {
                        size: 18
                    }
                }
            },
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }
            }
        }
    });

    document.getElementById('currentDate').textContent = formatDate(new Date());

    monthSelector.addEventListener('change', updateChart);
    yearSelector.addEventListener('change', updateChart);

    await updateChart();
    await updateDashboardCards();
    updateAttendancePieChart();
    populateRecentLogs();

    setInterval(async () => {
        await updateDashboardCards();
        updateAttendancePieChart();
    }, 60000);

});

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

async function updateDashboardCards() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate() - 1; // Adjust for 0-based index

    const totalEmployees = await fetchTotalEmployees();
    const shiftsCount = await fetchShifts();
    const departmentsCount = await fetchDepartments();

    // Calculate percentages for present, absent, and on leave
    const presentPercentage = 0.85; // Example: 85% present
    const absentPercentage = 0.10; // Example: 10% absent
    const onLeavePercentage = 0.05; // Example: 5% on leave

    const presentToday = Math.round(totalEmployees * presentPercentage);
    const absentToday = Math.round(totalEmployees * absentPercentage);
    const onLeaveToday = Math.round(totalEmployees * onLeavePercentage);

    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('presentToday').textContent = presentToday;
    document.getElementById('absentToday').textContent = absentToday;
    document.getElementById('onLeaveToday').textContent = onLeaveToday;
    document.getElementById('shiftsCount').textContent = shiftsCount;
    document.getElementById('departmentsCount').textContent = departmentsCount; // Update departments count

    // Update the date display
    document.getElementById('currentDate').textContent = formatDate(today);

    console.log('Dashboard updated:', { totalEmployees, presentToday, absentToday, onLeaveToday, date: formatDate(today) });
    
    updateAttendancePieChart(presentToday, absentToday, onLeaveToday);
}

function initializeMonthlyData() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Clear old data
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('attendanceData_') && key !== `attendanceData_${currentYear}_${currentMonth}`) {
            localStorage.removeItem(key);
        }
    });

    // Generate data for the current month if it doesn't exist
    fetchMonthlyData(currentYear, currentMonth);
}

let attendancePieChart;

function updateAttendancePieChart() {
    const presentToday = parseInt(document.getElementById('presentToday').textContent);
    const absentToday = parseInt(document.getElementById('absentToday').textContent);
    const onLeaveToday = parseInt(document.getElementById('onLeaveToday').textContent);

    // Calculate late (for this example, we'll assume 10% of present are late)
    const lateCount = Math.round(presentToday * 0.1);
    const actuallyPresent = presentToday - lateCount;

    const ctx = document.getElementById('attendancePieChart').getContext('2d');
    
    if (attendancePieChart) {
        attendancePieChart.destroy();
    }

    attendancePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Present (on time)', 'Present (late)', 'Absent', 'On Leave',],
            datasets: [{
                data: [actuallyPresent, lateCount, absentToday, onLeaveToday],
                backgroundColor: ['#003087', '#FFC107', '#ED1C24', '#4B5563']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Sample recent logs data
const recentLogsData = [
    { name: 'John Doe', action: 'Checked In', time: '08:30 AM' },
    { name: 'Jane Smith', action: 'Checked Out', time: '05:15 PM' },
    { name: 'Mike Johnson', action: 'Requested Leave', time: '02:45 PM' },
    { name: 'Emily Brown', action: 'Checked In (Late)', time: '09:10 AM' },
    { name: 'Alex Wilson', action: 'Checked In', time: '08:55 AM' },
    { name: 'Stephen Brown', action: 'Checked In', time: '09:00 AM' },

];

function populateRecentLogs() {
    const recentLogsContainer = document.getElementById('recentLogs');
    recentLogsContainer.innerHTML = ''; // Clear existing logs
    
    const table = document.createElement('table');
    table.className = 'w-full';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
       
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    recentLogsData.forEach(log => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
            <td class="py-2 text-xs text-gray-500 font-bold">${log.name}</td>
            <td class="py-2 text-xs text-gray-500">${log.action}</td>
            <td class="py-2 text-xs text-gray-500 text-right">${log.time}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    recentLogsContainer.appendChild(table);
}

async function fetchTotalEmployees() {
    try {
        const response = await fetch(`${backendURL}/api/user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error('Error fetching total employees:', error);
        return 0;
    }
}

async function setCsrfCookie() {
    await fetch(`${backendURL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
    });
}

// Call this function before any API requests
await setCsrfCookie();

async function fetchShifts() {
    try {
        const response = await fetch(`${backendURL}/api/shift`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.length; // Return the number of shifts
    } catch (error) {
        console.error('Error fetching shifts:', error);
        return 0;
    }
}

async function fetchDepartments() {
    try {
        const response = await fetch(`${backendURL}/api/department`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.length; // Return the number of departments
    } catch (error) {
        console.error('Error fetching departments:', error);
        return 0;
    }
}