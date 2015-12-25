var cfg    = require('../cfg');
var fn     = require('./functions');
var git    = require('git-rev-sync');
var output = require('./twitch/output');


function statusBot(channel, username, message, whisper)
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));

	if (whisper) {
		output.whisper(username, 'Bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
	}
    else {
    	output.sayNoCD(channel, '@' + username + ', bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
    }   
}

module.exports = 
{
	statusBot
}