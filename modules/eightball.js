var fs = require('graceful-fs');
var fn = require('./functions');
var output = require('./twitch/output');


function getRandomAnswer(channel, username, message, whisper)
{
	if (message.toLowerCase() === '!8ball') {
		return false;
	}
	if (message.indexOf('?') === -1) {
		console.log('[LOG] no question');
		return false;
	}

	fs.readdir('logs/' + channel.substr(1) + '/', function (err, files) {
		if (err) throw err;

		var answerLog = files[Math.floor(Math.random()*files.length)];

	    if (fn.getFilesizeInKilobytes('logs/' + channel.substr(1) + '/' + answerLog) < 1) {
	    	console.log('[LOG] skipped user answer');
	    	getRandomAnswer(channel, username, message, whisper);
	    	return false;
		}

	  	fs.readFile('logs/' + channel.substr(1) + '/' + answerLog, function (err, data) {
			if (err) {
				return false;
			}
	    	logsSplit = data.toString().split("\n");      
	        answer = logsSplit[Math.floor(Math.random()*logsSplit.length)];
	        answer = answer.split(']');
	        answer = answer[1];

	        if (answer.length > 100 || fn.stringContainsUrl(answer)) {
	        	console.log('[LOG] skipped user answer');
	        	getRandomAnswer(channel, username, message, whisper);
	        	return false;
	        }
	        if (whisper) {
	        	output.whisper(user, '"' + answer + ' "');
	        }
	        else {
	        	output.say(channel, '@' + username + ' "' + answer + ' "');
	        }
		});

	});
}

module.exports =
{
	getRandomAnswer
}