const fs              = require('fs');
const Q               = require('q');
const _               = require('lodash');
const path            = require('path');
const BufferStream    = require('q-io/buffer-stream');
const moment          = require('moment');

// Set this variable to the directory where your data lives
const DEFAULT_EVENT_DATA_PATH = '/Users/omardelarosa/Code/downloads/event_data_days/01_12_2016/';
const VALID_EVENTS = [ 
  'jobview', 
  'pageview', 
  'apply',
  'bgcheck',
  'register',
  'subscribe',
  'upgrade',
  'renew',
  'shortform',
  'longform',
  'resumeupload',
  'resultsview',
  'signup',
  'docupload',
  'quickregistration',
  'fullregistration',
  'skip',
  'type',
  'update',
  'offsite',
  'inclick',
  'event2',
  'expired',
  'button click',
  'cancel'
];

var lines = [];
var events = [];
var streams = [];
var currentBuffer;

function printError (err) {
  console.error(err.message);
  console.error(err.stack);
}

function processChunk (chunk) {

}

function splitLine (l) {
  const lineArr = l.split('\t');
  // console.log(l);
  var timestampString = lineArr[0] || "";
  var eventString = lineArr[2] || "";
  var time = Number(moment(timestampString.split(':').slice(1).join(':')).format('x'));
  var event = eventString.split(':').slice(1)[0];
  if (!_.includes(VALID_EVENTS, event)) {
   return null;
  }
  return {
    timestamp: time,
    event: event
  }
}

function start (dataPath) {
  return Q.Promise((resolve, reject, notify) => {
    fs.readdir(dataPath, (err, files) => {
      Q.all(
        files.filter((f) => f !== '.DS_Store')
          .map((f) => {
            return Q.Promise((resolve, reject, notify) => {
              resolve(fs.createReadStream(path.join(dataPath, f)).pause());
            });
          })
      ).then((results) => {
        results.map((r) => {
          r.on('readable', ()=> {
            var chunk
              , line = ""

            while (null !== (chunk = r.read(1))) {
              var aByte = chunk.toString();
              if (aByte !== '\n') {
               line += aByte; 
              } else {
                // add line
                event = splitLine(line);
                if (event) {
                  events.push(event);
                  console.log(event);
                }
                line = "";
              }
            }

          });
        });
      })
      .catch(printError);
    });
  });
}

start(DEFAULT_EVENT_DATA_PATH);
