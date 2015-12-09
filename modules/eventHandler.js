var cfg         = require('./../cfg');
var fn          = require('./functions');
var logs        = require('./logs.js');
var combo       = require('./combo');
var status      = require('./status');
var count       = require('./count');
var lines       = require('./lines');
var output      = require('./twitch/output');
var quote       = require('./quote');
var lastmessage = require('./lastmessage');
var eightball   = require('./eightball');
var skip        = require('./skip');

function channelEventHandler(channel, user, message, self) {
	combo.count(channel, user, message);
	logs.channelLogs(channel, user, message);
	logs.userLogs(channel, user, message);
	skip.countVotes(channel,user,message);

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(channel, user, message, false);

	// no cooldown commands
	switch (command) {
		case '!voting':
			if (cfg.trusted.indexOf(user.username) > -1) {
				skip.startVoting(channel, user, message, self);
			}
			break;
		case '!skip':
			skip.countVotes(channel, user, message);
			break;
		case '!stay':
			skip.countVotes(channel, user, message);
			break;
	}

	if (global.cooldown) {
		return false;
	}

	switch (command) {
		case '!logs':
			logs.logsCommandHandler(channel, user.username, message, false);
			break;
		case '!lines':
			lines.stats(channel, user.username, message, false);
			break;
		// case '!count':
		// 	count.count(channel, user, message, false);
		// 	break;
		case '!countme':
			count.countMe(channel, user.username, message, false);
			break;
		case '!8ball':
			eightball.getRandomAnswer(channel, user.username, message, false);
			break;
		case '!randomquote':
			quote.quoteUser(channel, user, message, false);
			break;
		case '!lastmessage':
			lastmessage.lastMessage(channel, user.username, message, false);
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
			lines.stats(cfg.options.channels[0], username, message, true);
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
		case '!lastmessage':
			lastmessage.lastMessage(cfg.options.channels[0], username, message, true);
			break;
	}
}

function adminCommands(channel, username, message, whisper) 
{
	if (!(username.username == cfg.admin)) {
		return false;
	}
	if (message.toLowerCase() === '!status') {
			status.statusBot(channel, username, message, whisper);
	}
	if (message.substr(0,8).toLowerCase() === '!nuclear') {
		console.log('test');
		nuclear.goNuclear(channel, username, message);
	} 
	else if (message.substr(0,4).toLowerCase() === '!say') {
		var toSay = message.substr(5);
		output.sayNoCD(channel, toSay);
	}
	else if (message.toLowerCase() === '!reboot') {
		console.log('[LOG] shutdown');
		output.say(channel, 'shutting down...');
	}
}

module.exports = 
{
	channelEventHandler,
	whisperEventHandler
}