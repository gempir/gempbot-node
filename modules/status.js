var cfg    = require('../cfg');
var fn     = require('./functions');
var git    = require('git-rev-sync');
var output = require('./twitch/output');


function statusBot(channel, user, message )
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));
    output.sayNoCD(channel, '@' + user['username'] + ', bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');    
}

module.exports = 
{
	statusBot
}