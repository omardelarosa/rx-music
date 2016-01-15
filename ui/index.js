var $ = require('jquery');
var _ = require('lodash');
var Synth = require('./synth');
var Sequencer = require('./sequencer');
var currentBeat = 0;
var DEFAULT_NUMBER_OF_BEATS = 16;
var DEFAULT_NOTE_RANGE = 16;
var DEFAULT_BPM = 120;
var DEFAULT_ROOT_NOTE = 220;
var DEFAULT_WAVEFORM = 'square';
var s;
var seq;
var notesQueue = [];

function buildTable () {
  var $container = $('#main-container');
  $container.empty();
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

function enqueueNote (n) {
  notesQueue.push(n);
}

function dequeueFirstNote () {
  var n = notesQueue.shift();
}

$(() => {
  console.log("RxMusic");
  
  var socket = io.connect('http://localhost:5005');
  socket.on('note', function (data) {
    // console.log("event", data);
    window.notesQueue.push( data );
  });

  synth = new Synth(DEFAULT_ROOT_NOTE, DEFAULT_NOTE_RANGE, DEFAULT_BPM, DEFAULT_WAVEFORM);
  seq = new Sequencer(DEFAULT_NUMBER_OF_BEATS, DEFAULT_NOTE_RANGE, synth);
  window.seq = seq;
  window.notesQueue = notesQueue;
  // wait for batch to fillup
  var interval = setInterval(() => {
    if (window.notesQueue.length > DEFAULT_NUMBER_OF_BEATS) {
      
      buildTable();
      seq.getNotesBatch(DEFAULT_NUMBER_OF_BEATS);
      seq.start(120, false);
      clearInterval(interval);
    }
  }, 100);
});
