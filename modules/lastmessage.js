
var fn        = require('./functions');
var output    = require('./twitch/output');
var fs        = require('fs'),
    readline  = require('readline');


function lastMessage(channel, username, message, whisper) {
	if (message === '!lastmessage') {
		return false;
	}
	
	var lastMessageFor = fn.getNthWord(message, 2);
	var file = 'logs/' + channel.substr(1) + '/' + lastMessageFor + '.txt';

	if (!fn.fileExists(file)) {
		return false;
	}
	
	fn.getLine(file, 0, function(err, line){
		var message = line.split(']');
	    if (whisper) {
	    	output.whisper(username, '" ' + message[1] + ' "');
	    }
	    else {
	    	output.say(channel, '" ' + message[1] + ' "');
	    }
	})
}

module.exports = 
{
	lastMessage
}