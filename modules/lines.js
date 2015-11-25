var twitch = require('./twitch');
var cfg = require('../cfg');
var fn = require('./functions');
var fs = require('graceful-fs');

var client = twitch.client;


client.on('chat', function (channel, user, message, self) {   
    if ( message.substr(0,6) === '!lines' && message != '!lines') {

    	var linesFor = fn.getNthWord(message,2).toLowerCase();
    	
    	if (linesFor === 'channel') {
			var fileChannel = 'logs/' + channel.substr(1) + '.txt';
	    	filePath = process.argv[2];
			fileBuffer =  fs.readFileSync(fileChannel);
			to_string = fileBuffer.toString();
			split_lines = to_string.split("\n");
			var lineCount = split_lines.length-1;
			lineCount = fn.numberFormatted(lineCount);
			client.say(channel, '@' + user['username'] + ', channel ' + channel.substr(1) + ' has ' + lineCount + ' lines');
    	}
    	else {
    		var file = 'logs/' + channel.substr(1) + '/' + linesFor +'.txt';
    		filePath = process.argv[2];
			fileBuffer =  fs.readFileSync(file);
			to_string = fileBuffer.toString();
			split_lines = to_string.split("\n");
			var lineCount = split_lines.length-1;
			lineCount = fn.numberFormatted(lineCount);
			client.say(channel, '@' + user['username'] + ', ' + linesFor + ' spammed ' + lineCount + ' lines');
    	}	
    }
});



