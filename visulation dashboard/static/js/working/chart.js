
// Cartd data starts here

// Sample data for main chart and detail data sets
const mainChartData = [10, 20, 30, 40];
const detailDataSets = {
    0: [1, 2, 3, 4],
    1: [5, 6, 7, 8],
    2: [9, 10, 11, 12],
    3: [13, 14, 15, 16]
};

// Get canvas elements
const mainChartCtx = document.getElementById('mainChart').getContext('2d');
const detailChartCtx = document.getElementById('detailChart').getContext('2d');

// Create the Detail Chart (initially empty)
const detailChart = new Chart(detailChartCtx, {
    type: 'line',
    data: {
        labels: ['Detail 1', 'Detail 2', 'Detail 3', 'Detail 4'],
        datasets: [{
            label: 'Detail Data',
            data: [], // Empty initially
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Create the Main Chart with an onClick event
const mainChart = new Chart(mainChartCtx, {
    type: 'bar',
    data: {
        labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
        datasets: [{
            label: 'Main Data',
            data: mainChartData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index; // Get index of clicked bar
                const data = detailDataSets[index]; // Get detail data for clicked bar
                updateDetailChart(data);
            }
        },
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        },
        indexAxis: 'y',
    }
});

// Function to update the detail chart with new data
function updateDetailChart(data) {
    detailChart.data.datasets[0].data = data; // Update data
    detailChart.update(); // Refresh chart
}
