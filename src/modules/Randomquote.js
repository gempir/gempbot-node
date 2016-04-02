import fs from 'fs';
import lib from './../lib';

export default class Randomquote
{
	constructor(bot)
	{
		this.bot  = bot;
		this.logs = __dirname +'/../../../logs/';
		this.fileMiss  = 0;
		this.quoteSkip = 0;
		this.date      = new Date();
        this.month     = [];
        this.month[0]  = "January";
        this.month[1]  = "February";
        this.month[2]  = "March";
        this.month[3]  = "April";
        this.month[4]  = "May";
        this.month[5]  = "June";
        this.month[6]  = "July";
        this.month[7]  = "August";
        this.month[8]  = "September";
        this.month[9]  = "October";
        this.month[10] = "November";
        this.month[11] = "December";
	}

	getQuote(channel, username, args, prefix)
	{
		if (this.fileMiss > 20) {
			this.fileMIiss = 0;
			console.log("[logs] didn\'t find userfile");
			return false;
		}
		var userToQuote = username;
		if (args.length > 0) {
			userToQuote = args[0];
		}
		this.getAllFilesFromFolder(this.logs + channel.substr(1) + '/'+ this.date.getFullYear(), (folders) => {
			var randMonth = folders[Math.floor(Math.random() * folders.length)];
			var userFile = this.logs + channel.substr(1) + '/' + this.date.getFullYear() + '/' + randMonth + '/' + userToQuote + '.txt';
			console.log(userFile);
			if (!lib.fileExists(userFile)) {
				this.fileMiss++;
		    	this.getQuote(channel, username, args, prefix);
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


		        while (true) {
					if (!(typeof quote == 'undefined')) {
						var filters = this.bot.filters.evaluate(quote)
						if (filters.length < 200 && filters.danger < 5) {
							break;
						}
					}
					console.log('[LOG] skipped user quote');
					quote = logsSplit[Math.floor(Math.random()*logsSplit.length)];
					quote = quote.split(']');
					quote = quote[1];


					if (this.quoteSkip > 50) {
		        		this.quoteSkip = 0;
						this.bot.say(channel, prefix + 'couldn\'t find a suitable quote');
		        		return false;
		        	}
					this.quoteSkip++;
		        }
		    	this.bot.say(channel, prefix + quote);
		    });
		});
	}

	getAllFilesFromFolder(dir, callback) {
		fs.readdir(dir, function(err, files) {
	        var dirs = [];
	        for (var index = 0; index < files.length; ++index) {
	            var file = files[index];
	            if (file != '.') {
	                dirs.push(file);
	            }
	        }
			return callback(dirs);
    	});
	}
}
