
var fn        = require('./functions');
var output    = require('./twitch/output');
var fs        = require('fs'),
    readline  = require('readline');


function lastMessage(channel, username, message, whisper) {
	if (message === '!lastmessage') {
		return false;
	}
	
	var lastMessageFor = fn.getNthWord(message, 2).toLowerCase();
	var file = 'logs/' + channel.substr(1) + '/' + lastMessageFor + '.txt';

	if (!fn.fileExists(file)) {
		return false;
	}
	
	fs.readFile(file, function(err, data){
        data = data.toString();
        var lines = data.split('\n');
        lastLine = lines[lines.length-2];
        lastLine = lastLine.split(']');
	    if (whisper) {
	    	output.whisper(username, '" ' + lastLine[1] + ' "');
	    }
	    else {
	    	output.say(channel, '" ' + lastLine[1] + ' "');
	    }
    })
	
}

module.exports = 
{
	lastMessage
}

