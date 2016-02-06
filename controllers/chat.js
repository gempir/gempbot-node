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
var config      = require('./../controllers/config');
var nuke        = require('./../modules/nuke');
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
    config.getTrusted(channel, function(trusted){
        if (trusted.indexOf(username) > -1) {
            trustedCommands(channel, username, message);
        }
    });

    if (user != null) {
        if (user['user-type'] === 'mod') {
            // mod stuff
        }
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

    if (global.globalcooldown) {
        console.log('[LOG] global cooldown');
		return false;
	}

    config.getActiveCommands(channel, function(activeCommands){
        if (!(activeCommands.indexOf(command) > -1)) {
            return false;
        }
        normalCommands(channel, username, message)
    });

    // normal stuff

}


function normalCommands(channel, username, message) {
    var command = fn.getNthWord(message, 1).toLowerCase();

    if (command === '!followage') {
		followage.followageCommandHandler(channel, username, message);
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
		config.getCommand(channel, command, function(commandObj) {
            if (commandObj === null || typeof commandObj === 'undefined') {
                return false;
            }
            console.log(commandObj);
            if (response.indexOf('--response') > -1) {
                response = response.replace('--response', '');
                output.say(channel, '@' + username + ', ' + response);
            }
            else {
                output.say(channel, response);
            }
        });
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
            adminController(channel, username, message);
            break;
        case '!command':
            commandsController(channel, username, message);
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

function adminController(channel, username, message)
{
    if (fn.countWords(message) <= 2) {
        return false;
    }
    var command = fn.getNthWord(message, 2).toLowerCase();
    switch(command) {
        case 'trusted':
            switchTrusted(channel, username, message);
    }
    function switchTrusted(channel, username, message) {
        if (fn.countWords(message) <= 3) {
            return false;
        }
        var command = fn.getNthWord(message, 3).toLowerCase();
        var trusted = fn.getNthWord(message, 4).toLowerCase();
        switch(command) {
            case 'add':
                config.setTrusted(channel, trusted);
                output.sayNoCD(channel, 'added ' + trusted + ' to trusted');
                break;
            case 'remove':
                config.removeTrusted(channel, trusted);
                output.sayNoCD(channel, 'removed ' + trusted + ' from trusted');
                break;
        }
    }
}

function commandsController(channel, username, message)
{
    if (fn.countWords(message) <= 3) {
        return false;
    }
    var command = fn.getNthWord(message, 2).toLowerCase();
    var commandName = fn.getNthWord(message, 3).toLowerCase();
    var commandMessage = fn.getNthWord(message, 4).toLowerCase();
    var messageArray = message.split(' ');
    if (typeof messageArray[3] != 'undefined') {
        var description = messageArray[3];
    }
    switch(command) {
        case 'add':
            addCommand(channel, commandName, commandMessage, description);
            break;
        case 'remove':
            break;
    }
}

function addCommand(channel, command, response, description) {
    description = description || '';

    var commandObj = {
        command: command,
        response: response,
        description: description,
        enabled: true
    }
    config.setCommand(channel, commandObj);
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
