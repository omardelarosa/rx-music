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
  this.interval = setInterval(()=>{
    var currentFrame = this.matrix[cursor];
    var notes = currentFrame.filter((n) => { return n });
    // update table
    var rows = [];
    currentFrame.forEach((n, idx) => {
      var $row = $(`#main-container .row:eq(${idx}) .col:eq(${cursor})`)
        .text(n || ".")
        .addClass('on')
        .addClass('played');

      if (n) {
        $row.addClass('note');
      }
      rows.push($row);
    });
    notes.forEach((n) => {
      this.synth.scheduleNote(this.synth.notes[n], 0);   
    });
    setTimeout(()=> {
      rows.forEach((r, idx) => { 
        var $r = $(r); 
        $r.removeClass('on'); 
        $r.removeClass('note'); 
      });
      rows = [];
    }, beatLength);

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
      $(`#main-container .row:eq(${b}) .col:eq(${n})`).text('').removeClass('played'); 
      beats.push(null);
    });
    this.matrix.push(beats);
  });
}

Sequencer.prototype.randomize = function () {
  this.synth.notes.forEach((n, idx) => {
    _.times(_.random(0,1), (n)=> {
      var noteIdx = _.random(0,this.synth.notes.length-1); 
      this.matrix[idx][noteIdx] = noteIdx;
      // make triad possible
      _.random(0,1) && this.matrix[idx][noteIdx+2] === null && (this.matrix[idx][noteIdx+2] = noteIdx+2);
      _.random(0,1) && this.matrix[idx][noteIdx+4] === null && (this.matrix[idx][noteIdx+4] = noteIdx+4);
    });
  });
}

Sequencer.prototype.stop = function () {
  clearInterval(this.interval);
}

module.exports = Sequencer;
