const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

var frequency = 440
var audioContext = new AudioContext()
var oscillator = audioContext.createOscillator()
oscillator.type = "sine"
oscillator.frequency.value = frequency
oscillator.connect(audioContext.destination)



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

oscillator.start()

function enableHand2() {
    oscillator2.start()
}

function changeSound(input) {
    if(input === undefined) { 
        return
    }
    //  let newFrequency = (input["bbox"][1] + input["bbox"][0])
        let newFrequency = (input["bbox"][0] + 200)
        console.log()
    oscillator.frequency.setValueAtTime(autoTune(newFrequency), audioContext.currentTime)
    // document.getElementById("frequencyP").innerText = cScale(newFrequency)[1]

}


function scalePrinter(start) {
    let output = []
    let frequency = start
    let i = 0
    let counter = 1
    while(i < 96) {
    frequency = frequency *2**(1/12)
    if(counter === 0 || counter === 2 || counter === 4 || counter === 5 || counter === 7 || counter === 9 || counter === 11) {
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

// function cScale(input) {
// let output = 0
//     if(input < 110) {
//     output = [110, "A2"]
//     }
//     else if (input > 110 && input <= 123.47) {
//     output = [123.47, "B2"]
//     }
//     else if (input > 123.47 && input <= 130.81) {
//     output = [130.81, "C3"]
//     }
//     else if (input > 130.81 && input <= 146.83) {
//     output = [146.83, "D3"]
//     }
//     else if (input > 146.83 && input <= 164.81) {
//     output = [164.81, "E3"]
//     }
//     else if (input > 164.81 && input <= 174.61) {
//     output = [174.61, "F3"]
//     }
//     else if (input > 174.61 && input <= 196.00) {
//     output = [196.00, "G3"]
//     }
//     else if (input > 196.00 && input <= 220.00) {
//     output = [220.00, "A3"]
//     }
//     else if (input > 220.00 && input <= 246.94) {
//     output = [246.94, "B3"]
//     }
//     else if (input > 246.94 && input <= 261.63) {
//     output = [261.63, "C4"]
//     }
//     else if (input > 261.63 && input <= 293.66) {
//     output = [293.66, "D4"]
//     }
//     else if (input > 293.66 && input <= 329.63) {
//     output = [329.63, "E4"]
//     }
//     else if (input > 329.63 && input <= 349.23) {
//     output = [349.23, "F4"]
//     }
//     else if (input > 349.23 && input <= 392.00) {
//     output = [392.00, "G4"]
//     }
//     else if (input > 392.00 && input <= 440.00) {
//     output = [440.00, "A4"]
//     }
//     else if (input > 440.00 && input <= 493.88) {
//     output = [493.88, "B4"]
//     }
//     else if(input > 493.88 && input <= 523.25) {
//     output = [523.25, "C5"]
//     }
//     else if(input > 523.25 && input <= 587.33) {
//     output = [587.33, "D5"]
//     }    
//     else if(input > 587.33 && input <= 659.25) {
//     output = [659.25, "E5"]
//     }
//     else if(input > 659.25 && input <= 698.46) {
//     output = [698.46, "F5"]
//     }
//     else if(input > 698.46) {
//     output = [783.99, "G5"]
//         }
// return output 
// }

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

    oscillator.stop()

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
    scale = scalePrinter(input)
    console.log(scale)
}
