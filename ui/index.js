var $ = require('jquery');
var Synth = require('./synth');
var Sequencer = require('./sequencer');
var currentBeat = 0;
var s;
var seq;

$(() => {
  console.log("started");
  
  var socket = io.connect('http://localhost:5005');
  socket.on('news', function (data) {
    // s.scheduleNote(s.notes[data.noteIndex],currentBeat);
    // currentBeat+=1;
  });

  synth = new Synth(440, 16, 120, 'square');
  // s.playScale();

  seq = new Sequencer(16,16,synth);
  window.seq = seq;
  seq.randomize();
  seq.start(120);
});
