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

function fetchMonthlyData(year, month) {
    const storageKey = `attendanceData_${year}_${month}`;
    const storedData = localStorage.getItem(storageKey);

    if (storedData) {
        return JSON.parse(storedData);
    }

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
                    onLeave = Math.floor(Math.random() * 3) + 1;
                    absent = Math.floor(Math.random() * 4) + 1;
                    present = 138 - onLeave - absent;
                } else {
                    onLeave = 0;
                    if (Math.random() < 0.3) {
                        present = 138;
                        absent = 0;
                    } else {
                        absent = Math.floor(Math.random() * 5) + 1;
                        present = 138 - absent;
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

function updateChart() {
    const selectedYear = parseInt(document.getElementById('yearSelector').value);
    const selectedMonth = parseInt(document.getElementById('monthSelector').value);

    const data = fetchMonthlyData(selectedYear, selectedMonth);

    employeeAttendanceChart.data.labels = data.labels;
    employeeAttendanceChart.data.datasets[0].data = data.presentEmployees;
    employeeAttendanceChart.data.datasets[1].data = data.absentEmployees;
    employeeAttendanceChart.data.datasets[2].data = data.employeesOnLeave;
    employeeAttendanceChart.update();

    console.log('Chart updated for:', { year: selectedYear, month: months[selectedMonth] });
}

// Add this at the top of your file with other global variables
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

document.addEventListener('DOMContentLoaded', function() {
    initializeMonthlyData();

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

    updateChart();
    updateDashboardCards(); // Initial update of dashboard cards

    setInterval(updateDashboardCards, 60000);

});

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateDashboardCards() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate() - 1; // Adjust for 0-based index

    const totalEmployees = 138;
    let currentMonthData = fetchMonthlyData(currentYear, currentMonth);

    const presentToday = currentMonthData.presentEmployees[currentDay] || 0;
    const absentToday = currentMonthData.absentEmployees[currentDay] || 0;
    const onLeaveToday = currentMonthData.employeesOnLeave[currentDay] || 0;

    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('presentToday').textContent = presentToday;
    document.getElementById('absentToday').textContent = absentToday;
    document.getElementById('onLeaveToday').textContent = onLeaveToday;

    // Update the date display
    document.getElementById('currentDate').textContent = formatDate(today);

    console.log('Dashboard updated:', { totalEmployees, presentToday, absentToday, onLeaveToday, date: formatDate(today) });
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