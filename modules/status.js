var cfg    = require('../cfg');
var fn     = require('./functions');
var git    = require('git-rev-sync');
var output = require('./twitch/output');


function statusBot(channel, user, message, whisper)
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));

	if (whisper) {
		output.whisper(user, 'Bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
	}
    else {
    	output.sayNoCD(channel, '@' + user['username'] + ', bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
    }   
}

module.exports = 
{
	statusBot
}