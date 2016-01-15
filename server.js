var express = require('express')
  , logfmt = require('logfmt')
  , bodyParser = require('body-parser')
  , path = require('path')
  , routes = require('./routes')
  , _ = require('lodash');

module.exports.start = (done) => {

  // middleware
  var app = express();
  var httpServer = require('http').Server(app);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/public'));
  app.use(logfmt.requestLogger());

  // bind routes
  routes(app);

  var port = Number(process.env.PORT);

  var server = app.listen(port, () => {
    console.log('Listening on port ' + port);
    
    if (done) {
      return done(null, app, server);
    }
  });

  server.on('error', (e) => {
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use.  Is the server already running?');
    }
    if (done) {
      return done(e);
    }
  });
 
  // bind sockets
  var io = require('socket.io')(5005);

  io.on('connection', function (socket) {
    setInterval(() => {
      socket.emit('news', { note: _.random(220,880) });
    }, 1000);
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

};

// Run the server if someone runs this file directly
if(path.basename(process.argv[1], '.js') === path.basename(__filename, '.js')) {
  module.exports.start();
}
