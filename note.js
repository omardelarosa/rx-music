var fs = require('fs');

var events = require("./sortedoutput2");
var realEvents = events.events;
console.log(events.events.length);

//var noteMapping = [ "C1", "D1", "E1", "F1", "G1", "A1", "B1", "C2", "D2", "E2", "F2", "G2", "A2", "B2", "C3", "D3" ];
//var noteMapping = [ "A1", "B1", "C1#", "D1", "E1", "F#1", "G#1", "A2", "B2", "C#2", "D2", "E2", "F#2", "G#2", "A3", "B3" ];

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
eventTypeMapping['skip']=17;
eventTypeMapping['type']=18;
eventTypeMapping['update']=19;
eventTypeMapping['offsite']=20;
eventTypeMapping['inclick']=21;
eventTypeMapping['event2'] =22;
eventTypeMapping['expired']=23;
eventTypeMapping['button click']=24;
eventTypeMapping['cancel'] = 25;

inverseEventMapping = [
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
fs.appendFileSync('music3.json', "[");

var findLowerBound = function(array){
	var q = 0;
	while (q < array.length){
		if(!hasNullTimestamp(array[q])){
			console.log("current lower bound event: ",array[q]);
			return array[q].timestamp;
		}
		q = q+1;
	}
	return 0;
}

var findUpperBound = function(array){
	var q = array.length;
	while (q > 0){
		if(!hasNullTimestamp(array[q-1])){
			return array[q-1].timestamp;
		}
		q = q-1;
	}
	return 0;
}

var computeMaxDensity = function(){
	var range = 0;
	maxDensity = 0;
	for(var i=0;i<realEvents.length;i = i+1){
		currentIntensityBatch.push(realEvents[i]);
		if(currentIntensityBatch.length % granularity == 0){
			var upper = findLowerBound(currentIntensityBatch);
			var lower = findUpperBound(currentIntensityBatch);
			range = Math.abs(lower-upper);
			if(range > maxDensity){
				maxDensity = range;
			}
		}
	}
	return maxDensity;
}

var hasNullTimestamp = function(val){
	return !(val !== null && val && val.timestamp !== 'undefined' && val.timestamp !== null);
}

var hasNullEvent = function(val){
	return (val === null || val.event === 'undefined') ;
}


var findNullTimestamps = function(array){
	for(var qq = 0; qq < array.length; qq = qq+1){
		if(hasNullTimestamp(array[qq])){
			return true;
		}
	}
	return false;
}
var computeNumerator = function(currentBatch){
	var theCount = 0;
	var a_event = 0;
	for(var k = 0; k < currentBatch.length; k = k+1){
		a_event = 'skip';
		if(!hasNullEvent(currentBatch[k])){
			a_event = currentBatch[k].event;
		}
		theCount = theCount + eventTypeMapping[a_event];
    }
    return theCount;
}

var granularity = 200;
var event = null;
var beat = null;
var currentBatch = [];
var currentIntensityBatch = [];
var numerator = null;
var intAvg = null;
var maxDensity = computeMaxDensity();
console.log("the max density was: ",maxDensity);
var currentNote = null;

var blankOutTheDelimeter = true;
var skip = 3;
var previousEvent = "";
var lift_factor = 1000000000.0;
//10000.0 the intial lift factor for the small dataset
for(var i=0;i<realEvents.length;i = i+1){

    event = realEvents[i];
    currentBatch.push(event);
    if(currentBatch.length > 1 && currentBatch.length % granularity == 0){
    	var numerator = computeNumerator(currentBatch);
    	var intAvg = Math.floor(numerator/currentBatch.length);
    	var delimiter = ",";
    	if(blankOutTheDelimeter){
    		delimiter = "";
    		blankOutTheDelimeter = false;
    	}
    	if(findNullTimestamps(currentBatch)){
    		currentNote = { eventName: event.event, notes: [] }; //return a rest
    		if(event.event!==null){
    			fs.appendFileSync('music3.json', delimiter+JSON.stringify(currentNote)+'\n');
    		}
    	}else{
    		var dateSpan = currentBatch[currentBatch.length-1].timestamp - currentBatch[0].timestamp;
    		//Still a bug with duration, keeping this here as a result.
    		//console.log("the dateSpan was: ",dateSpan);
    		//console.log("the duration ratio was: ",(dateSpan/maxDensity));
    		//console.log("the duration scaled ratio was: ",2.0*((dateSpan/maxDensity)*lift_factor));
    		var duration = Math.floor(((dateSpan/maxDensity)*lift_factor)*2.0);//kill the fake micros
    		//console.log("the duration was: ",duration);
    		
    		var outputEvent = inverseEventMapping[(intAvg+duration)%24];
    		var outputNotes = [eventTypeMapping[inverseEventMapping[(intAvg+duration)%24]]];
    		if(outputEvent!==null && outputNotes!==null && outputNotes[0]!=null){
    			for(var j=0;j<duration;j = j+1){
    				currentNote = { eventName: outputEvent, notes: outputNotes };
    				fs.appendFileSync('music3.json', delimiter+JSON.stringify(currentNote)+'\n');
    			}
    		}
    	}
    	currentBatch = [];
    }
}

fs.appendFileSync('music3.json', "]");


var exampleBeat = {
    eventName: 'jobview',
    notes: [ 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
};

