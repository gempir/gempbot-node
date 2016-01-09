var cfg         = require('./../cfg');
var fn          = require('./functions');
var logs        = require('./logs.js');
var combo       = require('./combo');
var status      = require('./status');
var count       = require('./count');
var lines       = require('./lines');
var output      = require('./../connection/output');
var quote       = require('./quote');
var lastmessage = require('./lastmessage');
var timer       = require('./timer');
var voting      = require('./voting');
var followage   = require('./followage');
var chatters    = require('./chatters');
var config      = require('./../managers/config');
var commands    = require('./../managers/commands');

function channelEventHandler(channel, user, message, self) {
	combo.count(channel, user, message);
	logs.channelLogs(channel, user, message);
	logs.userLogs(channel, user, message);

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(channel, user.username, message, false);

	if (global.trusted.indexOf(user.username) > -1 && message.substr(0,12).toLowerCase() === '!command add') {
		commands.addMessageCommand(channel, user.username, message, false);
	}
	if (global.trusted.indexOf(user.username) > -1 && message.substr(0,15).toLowerCase() === '!command remove') {
		commands.removeMessageCommand(channel, user.username, message, false);
	}

	// no cooldown commands
	switch (command) {
		case '!vote':
			if (global.voting) {
				voting.voteCommandHandler(channel, user, message);
			}
			break;
		case '!voting':
			if (global.trusted.indexOf(user.username) > -1) {
				voting.startVoting(channel, user, message, self);
			}
			break;
		case '!timer':
			timer.setTimer(channel, user.username, message);
			break;
	}

	if (global.cooldown) {
		return false;
	}

	if (!(global.activeCommands.indexOf(command) > -1)) {
		return false;
	}


	if (command === '!followage') {
		followage.followageCommandHandler(channel, user.username, message, false);
	}
	else if (command === '!chatters') {
		chatters.chattersCommandHandler(channel, user.username, message, false);
	}
	else if (command === '!logs') {
		logs.logsCommandHandler(channel, user.username, message, false);
	}
	else if (command === '!lines') {
		lines.stats(channel, user.username, message, false);
	}
	else if (command === '!countme') {
		count.countMe(channel, user.username, message, false);
	}
	else if (command === '!randomquote') {
		quote.getQuote(channel, user, message, false);
	}
	else if (command === '!lastmessage') {
		lastmessage.lastMessage(channel, user.username, message, false);
	}
	else if (command.substr(0,1) === '!') {
		commands.getMessageCommand(channel, user.username, message, false);
	}

}

function whisperEventHandler(username, message) {

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(cfg.options.channels[0], username, message, true);

	if (global.trusted.indexOf(username) > -1 && message.substr(0,12).toLowerCase() === '!command add') {
		commands.addMessageCommand(channel, username, message, true);
	}
	if (global.trusted.indexOf(username) > -1 && message.substr(0,15).toLowerCase() === '!command remove') {
		commands.removeMessageCommand(channel, username, message, true);
	}

	// no cooldown commands
	switch (command) {
		case '!vote':
			if (global.voting) {
				voting.voteCommandHandler(channel, username, message);
			}
			break;
	}

	if (global.whisperCooldown) {
		return false;
	}

	if (!(global.activeCommands.indexOf(command) > -1)) {
		return false;
	}

	if (command === '!followage') {
		followage.followageCommandHandler(channel, username, message, true);
	}
	else if (command === '!chatters') {
		chatters.chattersCommandHandler(channel, username, message, true);
	}
	else if (command === '!logs') {
		logs.logsCommandHandler(channel, username, message, true);
	}
	else if (command === '!lines') {
		lines.stats(channel, username, message, true);
	}
	else if (command === '!countme') {
		count.countMe(channel, username, message, true);
	}
	else if (command === '!randomquote') {
		quote.getQuote(channel, username, message, true);
	}
	else if (command === '!lastmessage') {
		lastmessage.lastMessage(channel, username, message, true);
	}
	else if (command.substr(0,1) === '!') {
		commands.getMessageCommand(channel, username, message, true);
	}
}

function adminCommands(channel, username, message, whisper)
{
	if (!(username === cfg.admin)) {
		return false;
	}
	if (message.toLowerCase() === '!status') {
			status.statusBot(channel, username, message, whisper);
	}
	else if (message.substr(0,6).toLowerCase() === '!admin') {
		config.admin(channel, username, message, whisper);
	}
	else if (message.substr(0,8).toLowerCase() === '!command') {
		commands.admin(channel, username, message, whisper);
	}
	else if (message.substr(0,4).toLowerCase() === '!say') {
		var toSay = message.substr(5);
		output.sayNoCD(channel, toSay);
	}
}

module.exports =
{
	channelEventHandler,
	whisperEventHandler
}
