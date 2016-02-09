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
var emotelog    = require('./../modules/emotelog');
var colors      = require('colors');
var emotecache  = require('./../src/models/emotecache');

channel.client.on('chat', function(channel, user, message, self) {
    eventHandler(channel, user, message);
});

channel.client.on('action', function(channel, user, message, self) {
    eventHandler(channel, user, message);
});

function eventHandler(channel, user, message)
{
    var username = user.username;

    lines.recordLines(channel, username, message);
    emotelog.incrementUserEmote(channel, user, message);
    emotelog.incrementEmote(channel, user, message);

    oddshots.saveChannelOddshots(channel, username, message);
    combo.count(channel, user, message);
    logs.userLogs(channel, username, message);
    chatters.recordChatters(channel, username, message);
    nuke.recordToNuke(channel, user, message);

    var command = fn.getNthWord(message, 1).toLowerCase();
    if (command.substr(0,1) != '!') {
        return false;
    }
    if (username.toLowerCase() === cfg.admin.toLowerCase()) {
        adminCommands(channel, username, message);
    }
    config.getTrusted(channel, function(trusted){
        if (trusted.indexOf(username.toLowerCase()) > -1) {
            trustedCommands(channel, username, message);
        }
    });

    // no CD
    switch (command) {
		case '!vote':
			voting.voteCommandHandler(channel, username, message);
			break;
		case '!timer':
			timer.setTimer(channel, username, message);
			break;
	}


    config.getActiveCommands(channel, function(activeCommands){
        if (!(activeCommands.indexOf(command) > -1)) {
            return false;
        }
        normalCommands(channel, username, message)
    });


}


function normalCommands(channel, username, message) {
    if (output.cooldowns.indexOf(channel) > -1) {
        console.log('[LOG] global cooldown'.gray);
		return false;
	}

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
		lines.lineCount(channel, username, message);
	}
	else if (command === '!countme') {
		count.countMe(channel, username, message);
	}
    else if (command === '!count') {
		count.count(channel, username, message);
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
            var response = commandObj.response;
            if (commandObj.response === true) {
                output.say(channel, '@' + username + ', ' + commandObj.message);
            }
            else {
                output.say(channel, commandObj.message);
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
        case '!say':
            var toSay = message.substr(5);
            output.sayNoCD(channel, toSay);
            break;
        case '!emotecache':
            emotecache.fetchEmotesFromBttv(function() {
                emotecache.cacheEmotes();
            });
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
    var messageArr     = message.split(' ');
    var response       = false;
    var command        = messageArr[1].toLowerCase() || '';
    var commandName    = messageArr[2] || '';

    if (command === 'add') {
        var commandMessage = fn.getLastChunkOfMessage(message, commandName);
        if (commandMessage === '' || commandName === '') {
            return false;
        }
        if (commandName.substr(0,1) != '!') {
            commandName = '!' + commandName;
        }
        if (commandMessage.indexOf('--response') > -1) {
            response = true;
            commandMessage = commandMessage.replace('--response', '');
        }
        addCommand(channel, commandName, commandMessage, response);
    }
    else if (command === 'remove') {
        if (commandName === '') {
            return false;
        }
        removeCommand(channel, commandName);
    }
}

function addCommand(channel, command, message, response) {
    var commandObj = {
        command: command,
        message: message,
        description: '',
        enabled: true,
        response: response
    }
    config.setCommand(channel, commandObj);
    output.sayNoCD(channel, 'added command ' + commandObj.command);
}

function removeCommand(channel, command) {
    if (command.substr(0,1) != '!') {
        command = '!' + command;
    }
    config.removeCommand(channel, command);
    output.sayNoCD(channel, 'removed command ' + command);
}

function trustedCommands(channel, username, message)
{
    if (message.substr(0,5).toLowerCase() === '!nuke') {
        nuke.nuke(channel, username, message);
    }
    if (message.substr(0,7).toLowerCase() === '!voting') {
        voting.startVoting(channel, username, message);
    }
    if (message.substr(0,8).toLowerCase() === '!command') {
        commandsController(channel, username, message);
    }
}
