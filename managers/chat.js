var channel     = require('./../connection/channel');
var whisper     = require('./../connection/whisper');
var cfg         = require('./../cfg');
var logs        = require('./../modules/logs.js');
var fn          = require('./../modules/functions');
var combo       = require('./../modules/combo');
var status      = require('./../modules/status');
var count       = require('./../modules/count');
var lines       = require('./../modules/lines');
var output      = require('./../modules/../connection/output');
var quote       = require('./../modules/quote');
var lastmessage = require('./../modules/lastmessage');
var timer       = require('./../modules/timer');
var voting      = require('./../modules/voting');
var followage   = require('./../modules/followage');
var chatters    = require('./../modules/chatters');
var config      = require('./../managers/config');
var commands    = require('./../managers/commands');
var nuke        = require('./../modules/nuke');
var ccount      = require('./../modules/ccount');
var oddshots    = require('./../modules/oddshots');

channel.client.on('chat', function(channel, user, message, self) {
    eventHandler(channel, user, message);
});

channel.client.on('action', function(channel, user, message, self) {
    eventHandler(channel, user, message);
});

function eventHandler(channel, user, message)
{
    var username = user.username;

    oddshots.saveChannelOddshots(channel, username, message);
    combo.count(channel, user, message);
    logs.userLogs(channel, username, message);
    chatters.recordChatters(channel, username, message);
    nuke.recordToNuke(channel, user, message);

    var command = fn.getNthWord(message, 1).toLowerCase();

    if (username.toLowerCase() === cfg.admin.toLowerCase()) {
        adminCommands(channel, username, message);
    }
    if (global.trusted.indexOf(username.toLowerCase()) > -1) {
        trustedCommands(channel, username, message);
    }

    if (user != null) {
        if (user['user-type'] === 'mod') {
            // mod stuff
        }
    }

    if (!(global.activeCommands.indexOf(command.toLowerCase()) > -1)) {
		return false;
	}

    // no CD
    switch (command) {
		case '!vote':
			voting.voteCommandHandler(channel, username, message);
			break;
		case '!timer':
			timer.setTimer(channel, username, message);
			break;
	}

    if (global.cooldown) {
        console.log('[LOG] global cooldown');
		return false;
	}

    ccount.ccountCommandUsage(command);

    // normal stuff

    if (command === '!followage') {
		followage.followageCommandHandler(channel, username, message);
	}
    else if (command === '!commands') {
        commands.getActiveCommands(channel, username, message);
    }
	else if (command === '!chatters') {
		chatters.chattersCommandHandler(channel, username, message);
	}
	else if (command === '!logs') {
		logs.logsCommandHandler(channel, username, message);
	}
	else if (command === '!lines') {
		lines.stats(channel, username, message);
	}
	else if (command === '!countme') {
		count.countMe(channel, username, message);
	}
    else if (command === '!ccount') {
		ccount.ccountCommandHandler(channel, username, message);
	}
	else if (command === '!randomquote') {
		quote.getQuote(channel, username, message);
	}
	else if (command === '!lastmessage') {
		lastmessage.lastMessage(channel, username, message);
	}
	else if (command.substr(0,1) === '!') {
		commands.getMessageCommand(channel, username, message);
	}

}


function adminCommands(channel, username, message)
{
    var command = fn.getNthWord(message, 1).toLowerCase();
    switch(command) {
        case '!status':
            status.statusBot(channel, username, message);
            break;
        case '!admin':
            config.admin(channel, username, message);
            break;
        case '!command':
            commands.admin(channel, username, message);
            break;
        case '!refresh':
            commands.refreshDB();
            break;
        case '!say':
            var toSay = message.substr(5);
            output.sayNoCD(channel, toSay);
            break;
    }
}


function trustedCommands(channel, username, message)
{
    if (message.substr(0,5).toLowerCase() === '!nuke') {
        nuke.nuke(channel, username, message);
    }
    if (message.substr(0,7).toLowerCase() === '!voting') {
        voting.startVoting(channel, username, message);
    }
    if (message.substr(0,12).toLowerCase() === '!command add') {
		commands.addMessageCommand(channel, username, message);
	}
	if (message.substr(0,15).toLowerCase() === '!command remove') {
		commands.removeMessageCommand(channel, username, message);
	}
}
