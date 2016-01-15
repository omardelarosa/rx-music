var $ = require('jquery');
var Synth = require('./synth');
var currentBeat = 0;
var s;

$(() => {
  console.log("started");
  
  var socket = io.connect('http://localhost:5005');
  socket.on('news', function (data) {
    // s.scheduleNote(s.notes[data.noteIndex],currentBeat);
    // currentBeat+=1;
  });

  s = new Synth(440, 16, 120, 'square');
  s.playScale();

  s2 = new Synth(440, 16, 90, 'triangle');
  s2.playScale();

  s3 = new Synth(440, 16, 60, 'triangle');
  s3.playScale();

  s4 = new Synth(440, 16, 30, 'triangle');
  s4.playScale();
});
