var cfg    = require('../cfg');
var fn     = require('./functions');
var git    = require('git-rev-sync');
var output = require('./twitch/output');

function statusHandler(channel, user, message)
{
	if (message.toLowerCase().substr(0,12) === '!status logs') {
		statusLogsUser(channel, user, message);
	}
	else if (message.toLowerCase().substr(0,7) === '!status') {
		statusBot(channel, user, message);
	}
}

function statusBot(channel, user, message )
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));
    output.say(channel, '@' + user['username'] + ', bot uptime: ' + uptime + ', branch: ' + git.branch() + ' (' + git.short() + ')');    
}

function statusLogsUser(channel, user, message) 
{
	if (message.toLowerCase() === '!status logs') {
		return false;
	}

	var messageStart = message.substr(0,12).toLowerCase();
	var name = fn.getNthWord(message, 3);
	
	name = name.toLowerCase();
	if (!fn.fileExists('logs/' + channel.substr(1) + '/' + name +  '.txt') && name != 'channel') {
    	
		if (fn.stringIsLongerThan(name, 20)) {
			name = 'the user';
		}
    	output.say(channel, '@' + user['username'] + ', ' + name + ' has no log here');        
    }
    else {
		if (name === 'channel') {
			var file = 'logs/' + channel.substr(1) + '.txt'
			var fileSize = fn.getFilesizeInKilobytes(file).toFixed(0);
			var extension = ' KB';
			if (fileSize > 1000) {
				fileSize = fn.getFilesizeInMegabytes(file).toFixed(2);
				extension = ' MB';
			}
			output.say(channel, '@' + user['username'] + ', ' + 'log file for channel ' + channel.substr(1) + ' is ' + fileSize + extension);
		}
		else {
			var file = 'logs/' + channel.substr(1) + '/' + name +  '.txt'
			var fileSize = fn.getFilesizeInKilobytes(file).toFixed(0);
			var extension = ' KB';
			if (fileSize > 1000) {
				fileSize = fn.getFilesizeInMegabytes(file).toFixed(2);
				extension = ' MB';
			}
			output.say(channel, '@' + user['username'] + ', ' + 'log file for ' + name + ' is ' + fileSize + extension);
		}
	}
}

module.exports = 
{
	statusHandler
}