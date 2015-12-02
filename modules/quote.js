var fs     = require('graceful-fs');
var fn     = require('./functions');
var output = require('./twitch/output');


function quoteCommandHandler(channel, user, message)
{
	if (message.toLowerCase() === '!randomquote') {
		randomQuoteFromChannel(channel, user, message);
	}
	if (message.toLowerCase() !== '!randomquote') {
		userToQuote = fn.getNthWord(message, 2);
		console.log(userToQuote);
		randomQuoteFromUser(channel, user, message, userToQuote);
	}
}



function randomQuoteFromChannel(channel, user, message) 
{

	fs.readFile('logs/' + channel.substr(1) + '.txt', function (err, data) {
		if (err) {
			console.log('randomquote channel fail');
		}
    	
    	logsSplit = data.toString().split("\n");
    	console.log(logsSplit[250]);        
        quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];

        if (quote.length > 150 || fn.stringContainsUrl(quote)) {
        	console.log('skipped channel quote');
        	randomQuoteFromChannel(channel, user, message);
        	return false;
        }
        output.say(channel, '" ' + quote + ' "');
    });
}


function randomQuoteFromUser(channel, user, message, userToQuote) 
{
	userToQuote = userToQuote.toLowerCase();
	fs.readFile('logs/' + channel.substr(1) + '/' + userToQuote + '.txt', function (err, data) {
		if (err) {
			output.say(userToQuote + ' has no logs here')
		}
		console.log('userToQuote: ' + userToQuote);
    	logsSplit = data.toString().split("\n");      
        quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];
        console.log('[QUOTE] : ' + quote);
        quote = quote.split(']');
        quote = quote[1];

        if (quote.length > 150 || fn.stringContainsUrl(quote)) {
        	console.log('skipped user quote');
        	randomQuoteFromUser(channel, user, message, userToQuote);
        	return false;
        }
        output.say(channel, '"' + quote + ' "');
    });
}


module.exports = 
{
	quoteCommandHandler
}