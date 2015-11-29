var cfg    = require('./../cfg');
var fn     = require('./functions');
var logs   = require('./logs.js');
var dbLogs = require('./db/logUsers');
var combo  = require('./combo');
var status = require('./status');
var count  = require('./count');
var lines  = require('./lines');
var dng    = require('./dungeon/dungeon');


function channelEventHandler(channel, user, message, self) {
	combo.count(channel, user, message);
	logs.channelLogs(channel, user, message);
	logs.userLogs(channel, user, message);
	dbLogs.log(channel, user, message);

	command = fn.getNthWord(message.toLowerCase(), 1);

	if (global.cooldown != false) {
		adminCommands(channel, user, message, command);
		return false;
	}

	switch (command) {
		case '!logs':
			logs.uploadLogs(channel, user, message);
			break;
		case '!status':
			status.statusHandler(channel, user, message);
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
		case '!dungeon':
			dng.dungeonHandler(channel, user, message);
			break;
	}
}

function adminCommands(channel, user, message, command) 
{
	if (command.substr(0,7) === '!status' && user.username == cfg.admin) {
			status.statusHandler(channel, user, message);
	} 
}


module.exports = 
{
	channelEventHandler
}