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

  s = new Synth(440, 16, 120, 'square');
  s.playScale();

});
