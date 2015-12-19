var fs     = require('graceful-fs');
var fn     = require('./functions');
var output = require('./twitch/output');

global.quoteCounter = 0;

function getQuote(channel, user, message, whisper) 
{
	if (message.toLowerCase() === '!randomquote') {
		getRandomQuote(channel, user.username, message, whisper)
        return false;
	}
	var userToQuote = fn.getNthWord(message, 2); 
	userToQuote = userToQuote.toLowerCase();
	userFile = 'logs/' + channel.substr(1) + '/' + userToQuote + '.txt';
	
	if (!fn.fileExists(userFile)) {
    	console.log('[LOG] ' + userToQuote + ' has no logs');
    	return false;
    }
    if (global.quoteSkip > 20) {
        return false;
    }

    fs.readFile(userFile, function (err, data) {
		if (err) {
			return false;
		}
    	logsSplit = data.toString().split("\n");      
        quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];
        quote = quote.split(']');
        quote = quote[1];

        if (quote.length < 10 || quote.length > 150 || fn.stringContainsUrl(quote)) {
        	global.quoteCounter++;
        	if (global.quoteCounter > 9) {
        		global.quoteCounter = 0;
        		return false;
        	}
        	console.log('[LOG] skipped user quote');
            global.quoteSkip += 1;
        	getQuote(channel, user, message, whisper);
        	return false;
        }
        if (whisper) {
        	output.whisper(user, '"' + quote + ' "');
        }
        else {
        	output.say(channel, '"' + quote + ' "');
        }
    });	
}


function getRandomQuote(channel, username, message, whisper)
{
    fs.readdir('logs/' + channel.substr(1) + '/', function (err, files) {
        if (err) throw err;

        var answerLog = files[Math.floor(Math.random()*files.length)];

        if (global.quoteSkip > 20) {
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
                getRandomQuote(channel, username, message, whisper);
                global.quoteSkip += 1;
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
	getQuote
}