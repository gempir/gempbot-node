var fn        = require('./../controllers/functions');
var fs        = require('fs'),
    readline  = require('readline');


function lastMessage(channel, username, message, callback) {
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
        var lastLine = lines[lines.length-2];
        lastLine = lastLine.split(']');

        var response = lastLine[1];

        if (fn.containsASCII(response) || fn.stringContainsUrl(response))  {
            return false;
        }
        if (response.length > 150) {
            response = response.substring(0, 150) + ' [...]';
        }
	    return callback({
            channel: channel,
            message: response
        });
    });
}

module.exports =
{
	lastMessage
}
