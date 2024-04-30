var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let attack = 0.02;
let release = 0.25;
let notelength = 0.75;
let tempo = 120;
let intervalId;
let stepIndex = 0;
// let stepIndex1 = 8;

function startSequencer() {
  intervalId = setInterval(playStep, 60000 / tempo);
  // intervalId = setInterval(playStep2, 60000 / tempo);
  document.getElementById("startButton").disabled = true;
  document.getElementById("stopButton").disabled = false;
}

function stopSequencer() {
  clearInterval(intervalId);
  document.getElementById("startButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
  stepIndex = 0;
  // stepIndex1 = 8;
}

function updateTempo() {
  tempo = document.getElementById("tempoSlider").value;
  document.getElementById("tempoValue").textContent = tempo;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(playStep, 60000 / tempo);
    // clearInterval(intervalId);
    // intervalId = setInterval(playStep2, 60000 / tempo);
  }
}

function playStep() {
  const checkbox = document.getElementById(`step${stepIndex + 1}`);
  if (checkbox.checked) {
    playMiddleC();
  }
  stepIndex = (stepIndex + 1) % 8;
}

function playMiddleC() {
  // Create an oscillator node and set parameters for sound
  let oscillator = audioCtx.createOscillator();
  oscillator.type = "triangle";
  let sustainlength = 1 - attack - release;
  // Connect the oscillator to the audio output (speakers)
  let adsr = audioCtx.createGain();
  oscillator.connect(adsr);
  adsr.connect(audioCtx.destination);

  // Set the oscillator frequency to middle C (261.63 Hz)
  oscillator.frequency.setValueAtTime(261.63, audioCtx.currentTime);

  adsr.gain.value = 0;

  // Start the oscillator
  oscillator.start();
  adsr.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack);
  adsr.gain.linearRampToValueAtTime(
    1,
    audioCtx.currentTime + attack + sustainlength
  );
  adsr.gain.linearRampToValueAtTime(0, audioCtx.currentTime + notelength);

  // Stop the oscillator after 1 second (adjust as needed)
  setTimeout(function () {
    oscillator.stop();
  }, notelength * 1000 + 100); // Adjust the time as needed
}

//LINE 2
// function playStep2() {
//   const checkbox = document.getElementById(`step${stepIndex1 + 1}`);
//   if (checkbox.checked) {
//     playG2();
//   }
//   stepIndex1 = (stepIndex1 + 1) % 16;
// }

// function playG2() {
//   // Create an oscillator node
//   let oscillator = audioCtx.createOscillator();
//   oscillator.type = "triangle";
//   let sustainlength = 1 - attack - release;
//   // Connect the oscillator to the audio output (speakers)
//   let adsr = audioCtx.createGain();
//   oscillator.connect(adsr);
//   adsr.connect(audioCtx.destination);

//   // Set the oscillator frequency to G2 (196 Hz)
//   oscillator.frequency.setValueAtTime(196, audioCtx.currentTime);

//   adsr.gain.value = 0;

//   // Start the oscillator
//   oscillator.start();
//   adsr.gain.linearRampToValueAtTime(1, audioCtx.currentTime + attack);
//   adsr.gain.linearRampToValueAtTime(
//     1,
//     audioCtx.currentTime + attack + sustainlength
//   );
//   adsr.gain.linearRampToValueAtTime(0, audioCtx.currentTime + notelength);

//   // Stop the oscillator after 1 second (adjust as needed)
//   setTimeout(function () {
//     oscillator.stop();
//   }, notelength * 1000 + 100); // Adjust the time as needed
// }
