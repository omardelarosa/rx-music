var fs = require('fs');

var events = require("./sortedOutput");

var noteMapping = [ "C1", "D1", "E1", "F1", "G1", "A1", "B1", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3" ];
var eventTypeMapping = [];
eventTypeMapping['jobview']		=1;
eventTypeMapping['pageview']	=2;
eventTypeMapping['apply']		=3;
eventTypeMapping['bgcheck']		=4;
eventTypeMapping['register']	=5;
eventTypeMapping['subscribe']	=6;
eventTypeMapping['upgrade']		=7;
eventTypeMapping['renew']		=8;
eventTypeMapping['shortform']	=9;
eventTypeMapping['longform']	=10;
eventTypeMapping['resumeupload']=11;
eventTypeMapping['resultsview'] =12;
eventTypeMapping['signup']		=13;
eventTypeMapping['docupload']	=14;
eventTypeMapping['quickregistration'] = 15;
eventTypeMapping['fullregistration'] = 16;
eventTypeMapping['skip']=10;
eventTypeMapping['type']=2;
eventTypeMapping['update']=4;
eventTypeMapping['offsite']=5;
eventTypeMapping['inclick']=6;
eventTypeMapping['event2'] =8;
eventTypeMapping['expired']=9;
eventTypeMapping['button click']=1;
eventTypeMapping['cancel'] = 10;

var writeStream = fs.createWriteStream('./music.json');
writeStream.write("[");
writeStream.end();

var granularity = 200;
var event = null;
var beat = null;
var currentBatch = [];
for(var i=0;i<events.length;i = i+1){

    event = events[i];
    currentBatch.push(event);
    if(currentBatch.length % granularity == 0){
    	
    	currentBatch = [];
    } 
    beat = {
		eventName: event.event,
		notes: [noteMapping[eventTypeMapping[event.event]]]  //basic pitch map.
    }
    fs.appendFile('music.json', JSON.stringify(beat)+'\n'+",", (err) => { //throwing down this sick beat ;)
        if (err) throw err;
    });
}
var exampleBeat = {
    eventName: 'jobview',
    notes: [ 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
};

