var _ = require('lodash');

function Sequencer (beats, notes) {
  this.matrix = [];
  _.times(beats, (b) => {
    var beats = [];
    console.log("b", b);
    _.times(notes, (n) => {
      console.log("n", n);
      beats.push(null);
    });
    this.matrix.push(beats);
  });
}

module.exports = Sequencer;
