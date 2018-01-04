let countdown;
const timerDisplay = document.querySelector('.display__time-left')
const endTimeDisplay = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('[data-time]')

function timer(seconds){
    clearInterval(countdown) // clear any existing timers
    const now = Date.now();
    const then  = now + seconds * 1000

    displayTimeLeft(seconds)
    displayEndTime(then)
    //console.log(now, then)
    countdown = setInterval(() => {
        const secondsLeft = Math.round( (then - Date.now())/1000 )
        //check if should stop
        if (secondsLeft < 0){
            clearInterval(countdown)
            return;
        }
        displayTimeLeft(secondsLeft)
    }, 1000)
}

function displayTimeLeft(seconds){
    //console.log(seconds)
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`
    document.title = display;
    timerDisplay.textContent = display
    console.log({minutes, remainderSeconds})
}


function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    const display = `${hour}:${minutes < 10 ? '0' : ''}${minutes}`
    endTimeDisplay.textContent = `Be Back @ ${display}`;

}


function startTimer() {
    const delay = parseInt( this.dataset.time ) //cast string to Integer
    timer(delay)
}

buttons.forEach(button => button.addEventListener('click', startTimer))
document.customForm.addEventListener('submit', function(e){
    e.preventDefault();
    //console.log(e)
    const mins = this.minutes.value;
    console.log(mins)
    timer(60*parseInt(mins))
    this.reset()
})