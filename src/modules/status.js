var cfg    = require('./../../cfg');
var fn     = require('./../controllers/functions');
var output = require('./../connection/output');


function statusBot(channel, username, message)
{
	var time = process.uptime();
	var uptime = fn.secsToTime((time + ""));
    output.sayNoCD(channel, '@' + username + ', bot uptime: ' + uptime);
}

module.exports =
{
	statusBot
}
