var fs = require('fs');

theEvents = require('./output2');
console.log(theEvents.events.length);
var writeStream = fs.createWriteStream('sortedoutput2.json', { flags:'w'});

sortedEvents = theEvents.events.sort(function(e1, e2){
	return new Date(e1.timestamp) - new Date(e2.timestamp);
});

var writeEvent = function(element, index, array){
    writeStream.write(JSON.stringify(element)+",");
}

writeStream.write("{\"events\":[");

theEvents.events.forEach(writeEvent);
writeStream.write("]}");
writeStream.end();