var pause = document.querySelector('.pause');
var play = document.querySelector('.play');
var btn = document.querySelector('#app');


btn.addEventListener('click', () => {
    if( play.classList.contains("active") )
    {
        play.classList.remove("active");
        pause.classList.add("active");
    }
    else
    {
        pause.classList.remove("active");
        play.classList.add("active");
    }
})

const ctx = document.getElementById('myChart')
const procesos = ['p1','p2','p3', 'p4', 'p5', 'p6']
const turnRound = [2,1,6,4,5,3]
Chart.defaults.color = '#fff';
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels : procesos,
        datasets: [{
            label: '',
            data: turnRound,
            backgroundClor: [
                '#111'
            ],
        }]
    }
})


