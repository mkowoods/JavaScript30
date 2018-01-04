const video = document.querySelector('.player'); //where the vid is pulled
const canvas = document.querySelector('.photo'); //where the image from vid is saved pulled ~15ms
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip'); //photo strip
const snap = document.querySelector('.snap');


let currentEffect = null;


function getVideo(){
    //returns Promise
    navigator.mediaDevices.getUserMedia({video : true, audio : false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error("OH NO!!", err);
        })
}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    console.log(width, height);

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        ctx.globalAlpha = 1.0
        switch(currentEffect) {
            case "red":
                pixels = redEffect(pixels);
                break;
            case "rgb":
                pixels = rgbSplit(pixels, alpha = 0.1);
                ctx.globalAlpha = 0.1
                break;
            case "green":
                pixels = greenScreen(pixels);
                break;
        }

        
        ctx.putImageData(pixels, 0, 0);
        //debugger;
    }, 20);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play()

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+= 4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100 //RED Channel
        pixels.data[i + 1] = pixels.data[i + 1] - 50 //GREEN Channel
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 //Blue Channel
    }
    return pixels
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+= 4){
        pixels.data[i - 150] = pixels.data[i + 0] //RED Channel
        pixels.data[i + 400] = pixels.data[i + 1] //GREEN Channel
        pixels.data[i - 550] = pixels.data[i + 2] //Blue Channel
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
        //console.log(levels)
    })

    for(let i = 0; i < pixels.data.length; i += 4){
        let [red, green, blue, alpha] = pixels.data.slice(i, i+4);
        
        if(
             red >= levels.rmin 
        && green >= levels.gmin
        && blue  >= levels.bmin
        &&  red  <= levels.rmax
        && green <= levels.gmax
        && blue  <= levels.bmax
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}


getVideo()

video.addEventListener('canplay', paintToCanvas);
 document.querySelectorAll(".effect-button").forEach(function(el){
        el.addEventListener("click", (e) => {
            let effect = e.target.dataset.effect
            currentEffect = (currentEffect === effect) ? null : effect
    })
})

