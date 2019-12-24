const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

let frequency = 440
let audioContext = new AudioContext()
let oscillator = audioContext.createOscillator()
oscillator.type = "sine"
oscillator.frequency.value = frequency
oscillator.connect(audioContext.destination)

let scale = []
let intervals = [2,4,5,7,9,11]


// var frequency2 = 261.6
// var audioContext2 = new AudioContext()
// var oscillator2 = audioContext.createOscillator()
// oscillator2.type = "sine"
// oscillator2.frequency.value = frequency2
// oscillator2.connect(audioContext.destination)


const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}
 
function enableHand2() {
    oscillator2.start()
}

function changeSound(input) {
    if(input === undefined) { 
        return
    }
    //  let newFrequency = (input["bbox"][1] + input["bbox"][0])
        let newFrequency = (input["bbox"][0] + 350)
    oscillator.frequency.setValueAtTime(autoTune(newFrequency), audioContext.currentTime)
}


function scalePrinter(start, intervals) {
    let output = []
    let frequency = start
    let i = 0
    let counter = 1
    while(i < 96) {
    frequency = frequency *2**(1/12)
    if(counter === 0 || intervals.includes(counter)) {
    output.push(frequency)
    }
    if(counter === 11){
    counter = 0
    } 
    else {counter ++}  
    i++
    } 
    return output
}


function autoTune(input) {
let output = null 
let i = 0
    while(output === null) {
        if(input > scale[i] && input <= scale[i+1]) {
            output = scale[i+1]
        }
    i++
    }
    return output
}
// function changeSound2hands(input) {
//     if (input=== undefined){return}
//     let frequency1 = input[0]["bbox"][0]
//     let frequency2 = input[1]["bbox"][1]
//     oscillator.frequency.setValueAtTime(frequency1, audioContext.currentTime)
//     oscillator2.frequency.setValueAtTime(frequency2, audioContext.currentTime)
// }
function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        oscillator.start();
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {

        // if(predictions.length > 1 ) {
        //     changeSound2hands(predictions)
        // }
        // else {
        // changeSound(predictions[0]) 
        // }
        changeSound(predictions[0]) 
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}


// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});


function scaleSelector(input) {
    scale = scalePrinter(input, intervals)
    console.log(scale)
}

function changeIntervals(input) {
    intervals = input
}


console.log(pizza) // // ReferenceError: pizza is not defined
let pizza = "delicious"


