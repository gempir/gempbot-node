var cfg    = require('../cfg');
var fn     = require('./functions');
var git    = require('git-rev-sync');
var output = require('./../connection/output');


function statusBot(channel, username, message)
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));
    output.sayNoCD(channel, '@' + username + ', bot uptime: ' + uptime + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
    
}

module.exports =
{
	statusBot
}
