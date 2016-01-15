var _ = require('lodash');
var $ = require('jquery');

function Sequencer (beats, notes, synth) {
  this.synth = synth;
  this.beats = beats;
  this.notes = notes;
  
  // initialize matrix
  this.reset();
}

Sequencer.prototype.start = function (bpm) {
  var beatLength = 60 * 1000 * (1/bpm);
  var cursor = 0;
  setInterval(()=>{
    var currentFrame = this.matrix[cursor];
    var notes = currentFrame.filter((n) => { return n });
    // update table
    console.log(currentFrame);
    currentFrame.forEach((n, idx) => {
      if (n) { $(`#main-container .row:eq(${idx}) .col:eq(${cursor})`).text(n); }
    });
    console.log(currentFrame);
    notes.forEach((n) => {
      this.synth.scheduleNote(n, 0);   
    });
    if (cursor >= this.beats-1) {
      cursor = 0;
      this.reset();
      this.randomize();
    } else {
      cursor += 1;
    }
  }, beatLength )
}

Sequencer.prototype.reset = function () {
  this.matrix = [];
  _.times(this.beats, (b) => {
    var beats = [];
    _.times(this.notes, (n) => {
      $(`#main-container .row:eq(${b}) .col:eq(${n})`).text(''); 
      beats.push(null);
    });
    this.matrix.push(beats);
  });
}

Sequencer.prototype.randomize = function () {
  this.synth.notes.forEach((n, idx) => {
    _.times(_.random(0,3), (n)=> {
      this.matrix[idx][n] = _.sample(this.synth.notes);
    });
  });
}

module.exports = Sequencer;
