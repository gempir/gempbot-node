var cfg     = require('./../cfg');
var fn      = require('./functions');
var logs    = require('./logs.js');
var dbLogs  = require('./db/logUsers');
var combo   = require('./combo');
var status  = require('./status');
var count   = require('./count');
var lines   = require('./lines');
var dng     = require('./dungeon/dungeon');
var queries = require('./db/queries');
var output  = require('./twitch/output');
var quote   = require('./quote');

function channelEventHandler(channel, user, message, self) {
	combo.count(channel, user, message);
	logs.channelLogs(channel, user, message);
	logs.userLogs(channel, user, message);
	dbLogs.log(channel, user, message);

	command = fn.getNthWord(message.toLowerCase(), 1);

	adminCommands(channel, user, message, command);

	if (global.cooldown != false) {
		return false;
	}

	switch (command) {
		case '!logs':
			logs.uploadLogs(channel, user, message);
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
		//case '!dungeon':
		//	dng.dungeonHandler(channel, user, message);
		//	break;

	}
}

function adminCommands(channel, user, message, command) 
{
	if (command.substr(0,7) === '!status') {
			status.statusHandler(channel, user, message);
	} 
	else if (command.substr(0,9) === '!reboot' && user.username == cfg.admin) {
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