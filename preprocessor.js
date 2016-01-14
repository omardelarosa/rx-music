const fs              = require('fs');
const Q               = require('q');
const _               = require('lodash');
const path            = require('path');
const BufferStream    = require('q-io/buffer-stream');
const moment          = require('moment');

// Set this variable to the directory where your data lives
const DEFAULT_EVENT_DATA_PATH = process.env.DEFAULT_EVENT_DATA_PATH || '/Users/omardelarosa/Code/downloads/event_data_days/01_12_2016/';
console.log(DEFAULT_EVENT_DATA_PATH);
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
var totalSize = 0;
var currentByte = 0;

function printError (err) {
  console.error(err.message);
  console.error(err.stack);
}

function processChunk (chunk) {

}

function clearShell() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
}

function splitLine (l) {
  const lineArr = l.split('\t');
  // console.log(l);
  var timestampString = lineArr[0] || "";
  var eventString = lineArr[2] || "";
  var time;
  try {
    time = Number(new Date(timestampString.split(':').slice(1).join(':')));
  } catch (e) {
    return null;
  }
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
       console.log(files);
       Q.all(
        files.filter((f) => f !== '.DS_Store')
          .map((f) => {
            return Q.Promise((resolve, reject, notify) => {
              var filepath = path.join(dataPath, f);
	      if(path.extname(filepath) !== ".gz"){
		  var theFile = fs.statSync(filepath);
		  totalSize += theFile.size;
		  resolve(fs.createReadStream(filepath).pause());
	      }
            });
          })
      ).then((results) => {
        results.map((r) => {
          r.on('readable', ()=> {
            var chunk
	    , line = "";
	    var counter = 1;
            while (null !== (chunk = r.read(1))) {
              currentByte += 1;
              var aByte = chunk.toString();
              if (aByte !== '\n') {
               line += aByte; 
              } else {
                // add line
                event = splitLine(line);
                if (event) {
		  events.push(event);
		  if(counter%1000 == 0){
		      //console.log(event);
		      clearShell();
		      console.log('progress: ', ((currentByte/totalSize)*100).toFixed(6));
		  }
                }
                line = "";
              }
	      counter+=1;
            }

          });
        });
       }).catch(printError)
    });
  });
}

start(DEFAULT_EVENT_DATA_PATH);
