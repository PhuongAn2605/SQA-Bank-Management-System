
let labels1 = ['January', 'March', 'May', 'July', 'September', 'November'];
let data1 = [1482, 1404, 1307, 1279, 1272, 1182];
let colors1 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF'];
let myChart1 = document.getElementById("myChart1").getContext('2d');
let chart1 = new Chart(myChart1, {
    type: 'bar',
    data: {
        labels: labels1,
        datasets: [ {
            data: data1,
            backgroundColor: colors1
        }]
    },
    options: {
        title: {
            text: "Transaction Frequency",
            display: false
        },
        legend: {
          display: false
        }
    }
});


let labels2 = ['*', '**', '***', '****', '*****'];
let myChart2 = document.getElementById("myChart2").getContext('2d');

let chart2 = new Chart(myChart2, {
    type: 'radar',
    data: {
        labels: labels2,
        datasets: [
            {
                label: 'Vistors',
                fill: true,
                backgroundColor: "rgba(5, 64, 242, 0.2)",
                borderColor: "rgb(5,64,242)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                data: [8, 10, 9, 6, 8]
              },
              {
                label: 'New Users',
                fill: true,
                backgroundColor: "rgba(2,115,42, 0.2)",
                borderColor: "rgba(2,115,42, 1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(2,115,42, 1)",
                data: [8, 7, 4, 8, 6.5]
              },
              {
                label: 'Loyal Customer ',
                fill: true,
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                borderColor: "rgba(255, 0, 0, 1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255, 0, 0, 1)",
                data: [6.5, 7.5, 4, 8, 10]
              },
              {
                label: "Longtime users",
                fill: true,
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                borderColor: "rgba(255, 165, 0, 1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255, 165, 0, 1)",
                data: [9, 7, 4, 8, 10]
              }
        ]
    },
    options: {
        title: {
            text: "Skills",
            display: false
        }
    }
});

let labels3 = ['Check Balance', 'Transfer money', 'Call Help Center', 'Check debit', 'Save money', 'Others'];
let data3 = [10, 20, 16, 14, 35, 5];
let colors3 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF', '#AC5353', '#CFD4D8'];

let myChart3 = document.getElementById("myChart3").getContext('2d');

let chart4 = new Chart(myChart3, {
    type: 'pie',
    data: {
        labels: labels3,
        datasets: [ {
            data: data3,
            backgroundColor: colors3
        }]
    },
    options: {
        title: {
            text: "Most in-demand programing language in 2020 (in percent)",
            display: false
        }
    }
});
