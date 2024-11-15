$(function () {

    let daterange = document.getElementById('daterange').value;

    console.log(daterange);
    
    daterange = daterange.replaceAll(' ', '');
    
    var start = moment(daterange.split("-")[0], 'DD/MMM/YYYY'); // Parse start date
    var end = moment(daterange.split("-")[1], 'DD/MMM/YYYY');   // Parse end date

    console.log(start, end)

    $('#daterange').daterangepicker({
        locale: {
            format: 'DD/MMM/YYYY'
        },

        startDate: start.isValid() ? start : moment(), // Set start date
        endDate: end.isValid() ? end : moment(),       // Set end date
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });
});
