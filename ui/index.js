var $ = require('jquery');
var _ = require('lodash');
var Synth = require('./synth');
var Sequencer = require('./sequencer');
var currentBeat = 0;
var DEFAULT_NUMBER_OF_BEATS = 16;
var DEFAULT_NOTE_RANGE = 16;
var DEFAULT_BPM = 120;
var DEFAULT_ROOT_NOTE = 440;
var DEFAULT_WAVEFORM = 'square';
var s;
var seq;

function buildTable () {
  var $container = $('#main-container');
  var height = $container.height();
  var width = $container.width();
  var paddingAmount = 5;
  var elWidth = Number.parseInt(width/DEFAULT_NUMBER_OF_BEATS-(paddingAmount*2))+'px';
  var elHeight = Number.parseInt((height/DEFAULT_NOTE_RANGE)-(paddingAmount*2))+'px';

  _.times(DEFAULT_NUMBER_OF_BEATS, (b) => {
    var $row = $('<div>')
    $row.addClass('row');
    $row.css({ height: elHeight });

    _.times(DEFAULT_NOTE_RANGE, (n) => {
      var $col = $('<div>');
      $col.addClass('col');
      $col.css({
          padding: paddingAmount+'px',
          width: elWidth,
          height: elHeight
        });
      $row.append($col);
    });
    $container.append($row);
  });
}

$(() => {
  console.log("RxMusic");
  
  var socket = io.connect('http://localhost:5005');
  socket.on('news', function (data) {
    // s.scheduleNote(s.notes[data.noteIndex],currentBeat);
    // currentBeat+=1;
  });

  buildTable();
  synth = new Synth(DEFAULT_ROOT_NOTE, DEFAULT_NOTE_RANGE, DEFAULT_BPM, DEFAULT_WAVEFORM);
  seq = new Sequencer(DEFAULT_NUMBER_OF_BEATS, DEFAULT_NOTE_RANGE, synth);
  window.seq = seq;
  seq.randomize();
  seq.start(120);
});
