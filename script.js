// Sets audio output to built-in output (Macbook Speakers)
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Parameters for playNote envelope
let notelength = 0.5;
let attack = 0.9; // attack is 25% of notelength
let release = 0.05; // release is 25% of notelength

// Sets default tempo to 120
let tempo = 120;

// Creates intervalId object and establishes stepIndex to start at 0
let intervalId;
let stepIndex = 0;

// Function for Start button
// Sets interval:tempo ratio
// Calls HTML controls to identify if on or off
function startSequencer() {
  intervalId = setInterval(playStep, 60000 / tempo);
  document.getElementById("startButton").disabled = true;
  document.getElementById("stopButton").disabled = false;
}
// Function for Stop button
// Calls html controls to identify if true or false
// Resets stepIndex to 0
function stopSequencer() {
  clearInterval(intervalId);
  document.getElementById("startButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
  stepIndex = 0;
}
// Function updates tempo slider
// Pulls from html controls to define tempo value
// Sets notelength:tempo ratio so notelength adjusts according to speed
function updateTempo() {
  tempo = document.getElementById("tempoSlider").value;
  document.getElementById("tempoValue").textContent = tempo;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(playStep, 60000 / tempo);
    notelength = 60 / tempo;
  }
}

// Function updates attack slider
// Pulls from html controls to define attack value
function updateAttack() {
  attack = document.getElementById("attackSlider").value;
  document.getElementById("attackValue").textContent = parseInt(attack * 100);
}

// Function updates release slider
// Pulls from html controls to define release value
function updateRelease() {
  release = document.getElementById("releaseSlider").value;
  document.getElementById("releaseValue").textContent = parseInt(release * 100);
}

// playStep function defines stepXX to checkbox rows 1-4 based on html classification
// if Note is checked, it will play the frequency value assigned from the drop down menu defined in html
function playStep() {
  console.log(stepIndex);
  const rowOneCheckbox = document.getElementById(`step${stepIndex + 1}`); // because stepIndex starts at 0,
  const rowTwoCheckbox = document.getElementById(`step${stepIndex + 9}`); // + X indicates the succesion of steps following
  const rowThreeCheckbox = document.getElementById(`step${stepIndex + 17}`);
  const rowFourCheckbox = document.getElementById(`step${stepIndex + 25}`);
  if (rowOneCheckbox.checked) {
    playNote(document.getElementById("rowOnePitch").value);
  }
  if (rowTwoCheckbox.checked) {
    playNote(document.getElementById("rowTwoPitch").value);
  }
  if (rowThreeCheckbox.checked) {
    playNote(document.getElementById("rowThreePitch").value);
  }
  if (rowFourCheckbox.checked) {
    playNote(document.getElementById("rowFourPitch").value);
  }
  stepIndex = (stepIndex + 1) % 8;
}

// Creates an oscillator node
// Calculates and defines parameters for sound at adjusted tempos

function playNote(freq) {
  let oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  let attackTime = attack * notelength;
  let releaseTime = release * notelength;
  let sustainlength = notelength - attackTime - releaseTime;

  // Connects oscillator to the amplitude envelope which then sends it to the audio output
  let adsr = audioCtx.createGain();
  oscillator.connect(adsr);
  adsr.connect(audioCtx.destination);

  // Sets the oscillator frequency to whatever note is selected
  // Because Value is (freq) it reads the numbers defined in html as frequencies
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  adsr.gain.value = 0;

  // Starts the oscillator
  oscillator.start();
  adsr.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + attackTime);
  adsr.gain.linearRampToValueAtTime(
    0.25,
    audioCtx.currentTime + attackTime + sustainlength
  );
  adsr.gain.linearRampToValueAtTime(0, audioCtx.currentTime + notelength);

  // Stops the oscillator
  setTimeout(function () {
    console.log(adsr.gain.value);
    oscillator.stop();
  }, notelength * 1000 + 100);
}
