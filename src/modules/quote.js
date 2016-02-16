var fs     = require('fs');
var fn     = require('./../controllers/functions');
var output = require('./../connection/output');

var quoteSkip = 0;

function getQuote(channel, username, message, callback)
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

    fs.readFile(userFile, function (err, data) {
		if (err) {
			return false;
		}
    	logsSplit = data.toString().split("\n");
        var quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];
        quote = quote.split(']');
        quote = quote[1];

		if (typeof quote === 'undefined') {
			return false;
		}

        if (quote.length > 200 || fn.stringContainsUrl(quote)) {
			console.log('[LOG] skipped user quote');
			quoteSkip++;
        	if (quoteSkip > 10) {
        		quoteSkip = 0;
        		return false;
        	}
        	getQuote(channel, username, message, callback);
        	return false;
        }
    	return callback({
			channeL: channel,
			message: '"' + quote + ' "'
		});
    });
}

module.exports =
{
	getQuote
}
