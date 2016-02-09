
var fn        = require('./../controllers/functions');
var output    = require('./../connection/output');
var fs        = require('graceful-fs'),
    readline  = require('readline');


function lastMessage(channel, username, message) {
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

        var response = lastLine[1];

        if (fn.containsASCII(response))  {
            return false;
        }
        if (response.length > 150) {
            response = response.substring(0, 150) + ' [...]';
        }
	    output.say(channel, '" ' + response + ' "');
    });
}

module.exports =
{
	lastMessage
}
