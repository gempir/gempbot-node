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

	adminCommands(channel, user, message, false);

	if (global.cooldown) {
		return false;
	}

	switch (command) {
		case '!logs':
			logs.logsCommandHandler(channel, user, message, false);
			break;
		case '!lines':
			lines.countLines(channel, user, message, false);
			break;
		case '!count':
			count.count(channel, user, message, false);
			break;
		case '!countme':
			count.countMe(channel, user.username, message, false);
			break;
		case '!randomquote':
			quote.quoteUser(channel, user, message, false);
			break;
	}
}

function whisperEventHandler(username, message) {

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(cfg.options.channels[0], username, message, true);

	if (global.whisperCooldown) {
		return false;
	}

	switch (command) {
		case '!logs':
			logs.logsCommandHandler(cfg.options.channels[0], username, message, true);
			break;
		case '!lines':
			lines.countLines(cfg.options.channels[0], username, message, true);
			break;
		case '!count':
			count.count(cfg.options.channels[0], username, message, true);
			break;
		case '!countme':
			count.countMe(cfg.options.channels[0], username, message, true);
			break;
		case '!randomquote':
			quote.quoteUser(cfg.options.channels[0], username, message, true);
			break;
	}
}

function adminCommands(channel, user, message, whisper) 
{
	if (message.toLowerCase() === '!status') {
			status.statusBot(channel, user, message, whisper);
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
	channelEventHandler,
	whisperEventHandler
}