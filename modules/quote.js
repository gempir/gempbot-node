var fs     = require('graceful-fs');
var fn     = require('./functions');
var output = require('./twitch/output');

global.quoteCounter = 0;

function quoteUser(channel, user, message, whisper) 
{
	if (message.toLowerCase() === '!randomquote') {
		return false;
	}
	var userToQuote = fn.getNthWord(message, 2); 
	userToQuote = userToQuote.toLowerCase();
	userFile = 'logs/' + channel.substr(1) + '/' + userToQuote + '.txt';
	
	if (!fn.fileExists(userFile)) {
    	console.log('[LOG] ' + userToQuote + ' has no logs');
    	return false;
    }
    if (fn.getFilesizeInKilobytes(userFile) < 1) {
    	console.log('[LOG] ' + userToQuote + ' logs less than 1KB');
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
        	quoteUser(channel, user, message, whisper);
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


module.exports = 
{
	quoteUser
}