var $ = require('jquery');

$(() => {
  console.log("started");
  
  var socket = io.connect('http://localhost:5005');
  socket.on('news', function (data) {
    console.log(data);
    // socket.emit('my other event', { my: 'data' });
  });

});
