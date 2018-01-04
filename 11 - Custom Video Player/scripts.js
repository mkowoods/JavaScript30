let vid = document.querySelector(".player__video");
let play_button = document.querySelector(".player__button");
let progress_bar = document.querySelector(".progress")
let progress_fill = progress_bar.querySelector(".progress__filled")
let skip_btns = document.querySelectorAll(".player__button[data-skip]")
let vol_slider = document.querySelector(".player__slider[name=volume]")
let playback_slider = document.querySelector(".player__slider[name=playbackRate]")
let full_screen = document.querySelector(".full-screen")

function playButton(){
    if(vid.paused){
        vid.play()
    } else {
        vid.pause()
    }
}
function updateButton(){
    play_button.innerHTML = (vid.paused ? "&#10074; &#10074;" : "►")
}

function progressBar(e){
    let current_perc = 100*(this.currentTime/this.duration);
    progress_fill.style.flexBasis = current_perc + "%"
}

function seek(e) {
    let seek = parseInt(this.dataset.skip, 10)
    vid.currentTime += seek
}

function scrub(e){
    let scrub_perc = (e.offsetX / progress_bar.offsetWidth)
    vid.currentTime = scrub_perc * vid.duration
}

function fullScreen(){
    vid.webkitRequestFullscreen()
}

play_button.addEventListener("click", playButton);
vid.addEventListener("click", playButton);
vid.addEventListener("timeupdate", progressBar)
vid.addEventListener("play", updateButton)
vid.addEventListener("pause", updateButton)

full_screen.addEventListener("click", fullScreen)



let mousedown = false;
progress_bar.addEventListener("mousemove", (e) => mousedown && scrub(e))
progress_bar.addEventListener("mousedown", () => {mousedown = true})
progress_bar.addEventListener("mouseup", () => mousedown = false)

progress_bar.addEventListener("click", scrub)

vol_slider.addEventListener("change", () => {
    vid.volume = vol_slider.value;
})

playback_slider.addEventListener("change", () => {
    vid.playbackRate = playback_slider.value
})



skip_btns.forEach(skip_btn => { 
    skip_btn.addEventListener("click", seek)
})

play_button.click()