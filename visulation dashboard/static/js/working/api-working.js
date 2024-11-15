async function getRequest(url) {
    console.log(url);
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            return data;

        })
        .catch(function (error) {
            console.error('Error:', error);
            throw new Error('Failed to fetch data');
        });
}

async function getData() {

    let url_search = new URLSearchParams(location.search);

    let gender = url_search.get('gender');
    let age = url_search.get('age');
    let daterange = document.getElementById('daterange').value;

    let complete_url = `/get-data?gender=${gender}&age=${age}&daterange=${daterange}`

    const data = await getRequest(complete_url);

    const average_data = data[data.length - 1]

    let mainChartData = [];
    let labels = []
    detailDataSets = {};

    dates = []

    for (let i = 0; i < Object.keys(average_data).length; i++) {
        mainChartData.push(average_data[Object.keys(average_data)[i]]);
        labels.push(Object.keys(average_data)[i]);

    }

    for (let i = 0; i < data.length; i++) {
        let dateObj = new Date(data[i]['Day'])
        const options = { month: 'short', day: 'numeric', year: '2-digit' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        dates.push(formattedDate)

        const push_data = data[i];

        for (let labelIndex in labels) {
            const label = labels[labelIndex]

            let value = push_data[label]

            if (detailDataSets[labelIndex] === undefined) {
                detailDataSets[labelIndex] = []
            }

            detailDataSets[labelIndex].push(value);

        }

    }

    updateMainChart(mainChartData, labels, detailDataSets, dates)

}



// chart working here

// Cartd data starts here

// Sample data for main chart and detail data sets
var mainChartData = [10, 20, 30, 40];
var detailDataSets = {
    0: [1, 2, 3, 4],
    1: [5, 6, 7, 8],
    2: [9, 10, 11, 12],
    3: [13, 14, 15, 16]
};
var labels = ['Category 1', 'Category 2', 'Category 3', 'Category 4']

var dates = ['Detail 1', 'Detail 2', 'Detail 3', 'Detail 4']


const detailChartCtx = document.getElementById('detailChart').getContext('2d');

// Create the Detail Chart (initially empty)
let detailChart = new Chart(detailChartCtx, {
    type: 'line',
    data: {
        labels: dates,
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
document.getElementById('mainChart').innerHTML = "";
const mainChartCtx = document.getElementById('mainChart').getContext('2d');
let mainChart = new Chart(mainChartCtx, {
    type: 'bar',
    data: {
        labels: labels,
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
                console.log(data);

                updateDetailChart(data, dates);
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

// createMainChart(mainChartData, labels, detailDataSets)

// Function to update the detail chart with new data
function updateDetailChart(data, dates) {
    // Destroy the existing chart (if any)
    if (detailChart) {
        detailChart.destroy();
    }

    // Create a new chart with updated data
    detailChart = new Chart(detailChartCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Detail Data',
                data: data, // New data
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
}

function updateMainChart(mainChartData, labels, detailDataSets, dates) {
    // destroy the existing chart

    if (detailChart) {
        detailChart.destroy()

        detailChart = new Chart(detailChartCtx, {
            type: 'line',
            data: {
                labels: dates,
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
    }

    if (mainChart) {
        mainChart.destroy()

        // create a new chart with updated data
        mainChart = new Chart(mainChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
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
                        console.log('index edher h...=>', index)
                        const data = detailDataSets[index]; // Get detail data for clicked bar
                        console.log(data);
                        console.log('deails sett ether ihhh. =>', detailDataSets)

                        updateDetailChart(data, dates);
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
    }
}