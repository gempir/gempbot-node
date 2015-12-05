var cfg     = require('./../cfg');
var fn      = require('./functions');
var logs    = require('./logs.js');
var combo   = require('./combo');
var status  = require('./status');
var count   = require('./count');
var lines   = require('./lines');
var output  = require('./twitch/output');
var quote   = require('./quote');

function channelEventHandler(channel, user, message, self) {
	combo.count(channel, user, message);
	logs.channelLogs(channel, user, message);
	logs.userLogs(channel, user, message);

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(channel, user, message, command);

	if (global.cooldown != false) {
		return false;
	}

	switch (command) {
		case '!logs':
			logs.logsCommandHandler(channel, user, message);
			break;
		case '!lines':
			lines.countLines(channel, user, message);
			break;
		case '!count':
			count.count(channel, user, message);
			break;
		case '!countme':
			count.countMe(channel, user, message);
			break;
		case '!randomquote':
			quote.quoteCommandHandler(channel, user, message);
			break;
	}
}

function adminCommands(channel, user, message, command) 
{
	if (message.toLowerCase() === '!status') {
			status.statusBot(channel, user, message);
	} 
	else if (message.toLowerCase() === '!reboot' && user.username == cfg.admin) {
		console.log('shutdown');
		queries.setAllUsersToIdle(function(){
			output.say(channel, 'shutting down...');
			process.exit()
		});
	}	
}

module.exports = 
{
	channelEventHandler
}