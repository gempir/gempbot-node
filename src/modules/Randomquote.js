import fs from 'fs';
import fn from './../controllers/functions';

export default class Randomquote
{
	constructor(bot)
	{
		this.bot  = bot;
		this.logs = __dirname +'/../../../logs/';
		this.quoteSkip = 0;
	}

	getQuote(channel, username, args, prefix)
	{
		var userToQuote = username;
		if (args.length > 0) {
			userToQuote = args[0];
		}

		var userFile = this.logs + channel.substr(1) + '/' + userToQuote + '.txt';

		if (!fn.fileExists(userFile)) {
	    	console.log('[LOG] ' + userToQuote + ' has no logs');
	    	return false;
	    }

	    fs.readFile(userFile, (err, data) => {
			if (err) {
				return false;
			}
	    	var logsSplit = data.toString().split("\n");
	        var quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];
	        quote = quote.split(']');
	        quote = quote[1];

			if (typeof quote === 'undefined') {
				return false;
			}

	        if (quote.length > 200 || fn.stringContainsUrl(quote)) {
				console.log('[LOG] skipped user quote');
				this.quoteSkip++;
	        	if (this.quoteSkip > 25) {
	        		this.quoteSkip = 0;
					this.bot.say(channel, prefix + 'couldn\'t find a suitable quote');
	        		return false;
	        	}
	        	this.getQuote(channel, username, message, callback);
	        	return false;
	        }
	    	this.bot.say(channel, prefix + quote);
	    });
	}
}
