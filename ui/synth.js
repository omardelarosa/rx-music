const _ = require('lodash');

module.exports = Synth;

// Builds a major scale
function __buildScale (maxNotes, root) {
  var notes = [];

  _.times(maxNotes, (n) => {
    var octave = Math.floor(n/7)
      , frequencyAdjust;
    switch (n % 7) {
      case 0:
        frequencyAdjust = 1;
        break;
      case 1:
        frequencyAdjust = 9/8;
        break;
      case 2:
        frequencyAdjust = 5/4;
        break;
      case 3:
        frequencyAdjust = 4/3;
        break;
      case 4:
        frequencyAdjust = 3/2;
        break;
      case 5:
        frequencyAdjust = 5/3;
        break;
      case 6:
        frequencyAdjust = 15/8;
        break;
    }
    notes.push(
      Number.parseInt(
        root*(frequencyAdjust*(Math.pow(2,octave)))
      )
    );
  });

  return notes;
}


function Synth (root, maxNotes, bpm, waveform) {
  if ('number' !== typeof root ) {
    throw new Error(
      `Invalid root: '${root}' Root note must be an integer`
    );
  }
  this.noteDuration = Number.parseInt(60 * 1000 / bpm);
  this.waveform = waveform;
  this.notes = __buildScale(maxNotes, root); 

  this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

};

Synth.prototype.createNote = function (freq) {
  const oscillator = this.audioContext.createOscillator();
  const gainNode = this.audioContext.createGain();
  gainNode.gain.value = 0.1;
  oscillator.type = this.waveform;

  oscillator.connect(gainNode);
  gainNode.connect(this.audioContext.destination);
  oscillator.frequency.value = freq;

  return {
    start: () => oscillator.start(0),
    stop: () => oscillator.stop()
  };
};

Synth.prototype.scheduleNote = function (freq, beat) {
  var f = freq;
  setTimeout(() => {
    var note = this.createNote(f);
    note.start();
    setTimeout(() => note.stop(), this.noteDuration);
  }, beat * this.noteDuration);
}

Synth.prototype.playScale = function () {
  this.notes.forEach((note, idx) => {
    this.scheduleNote(note, idx);
  });
};
