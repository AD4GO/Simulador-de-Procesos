const ctx = document.getElementById('myChart')
const procesos = ['p1','p2','p3', 'p4', 'p5', 'p6']
const turnRound = [2,1,6,4,5,3]

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels : procesos,
        datasets: [{
            label: 'turnRound',
            data: turnRound,
            backgroundClor: [
                '#111'
            ]
        }]
    }
})
