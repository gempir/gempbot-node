var cfg         = require('./../../cfg');
var irc         = require('./irc');
var logs        = require('./../modules/logs.js');
var fn          = require('./functions');
var combo       = require('./../modules/combo');
var count       = require('./../modules/count');
var lines       = require('./../modules/lines');
var quote       = require('./../modules/quote');
var lastmessage = require('./../modules/lastmessage');
var voting      = require('./../modules/voting');
var followage   = require('./../modules/followage');
var chatters    = require('./../modules/chatters');
var config      = require('./../controllers/config');
var nuke        = require('./../modules/nuke');
var oddshots    = require('./../modules/oddshots');
var emotelog    = require('./../modules/emotelog');
var emotecache  = require('./../models/emotecache');
var redis       = require('./../models/redis');


irc.event.on('message', function(channel, user, message) {
    console.log(channel, user.username, message);
    eventHandler(channel, user, message);
})

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
        if (trusted.indexOf(username.toLowerCase()) > -1 || cfg.admin.toLowerCase() === username.toLowerCase()) {
            trustedCommands(channel, username, message);
        }
    });

    // no CD
    switch (command) {
		case '!vote':
			voting.voteCommandHandler(channel, username, message);
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
    if (irc.userCooldowns.indexOf(username) > -1) {
        console.log('[LOG] user cooldown');
		return false;
	}

    var command = fn.getNthWord(message, 1).toLowerCase();

    if (typeof irc.commandCooldowns[channel] === 'undefined') {
        irc.commandCooldowns[channel] = [];
    }
    if (irc.commandCooldowns[channel].indexOf(command) > -1) {
        console.log('[COMMAND] ' + command + ' cooldown');
        return false;
    }

    redis.hgetall(channel + ':commands', function(err, reply) {
        if (err) {
            return false;
        }

        var commObj = JSON.parse(reply[command]);

        if (command === '!followage') {
    		followage.followageCommandHandler(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!chatters') {
    		chatters.chattersCommandHandler(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!logs') {
    		logs.logsCommandHandler(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!lines') {
    		lines.lineCount(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!countme') {
    		count.countMe(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
        else if (command === '!count') {
    		count.count(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!randomquote') {
    		quote.getQuote(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command === '!lastmessage') {
    		lastmessage.lastMessage(channel, username, message, function(response) {
                irc.sayCommand(channel, username, response, commObj);
            });
    	}
    	else if (command.substr(0,1) === '!') {
    		config.getCommand(channel, command, function(commandObj) {

                if (commandObj === null || typeof commandObj === 'undefined') {
                    return false;
                }
                var response = commandObj.response;
                if (commandObj.response === true) {
                    irc.say(channel, '@' + username + ', ' + commandObj.message);
                }
                else {
                    irc.say(channel, commandObj.message);
                }
            });
    	}
    });
}


function adminCommands(channel, username, message)
{
    var command = fn.getNthWord(message, 1).toLowerCase();
    switch(command) {
        case '!status':
            var time = process.uptime();
            var uptime = fn.secsToTime((time + ""));
            irc.say(channel, '@' + username + ', bot uptime: ' + uptime);
            break;
        case '!admin':
            adminController(channel, username, message);
            break;
        case '!say':
            var toSay = message.substr(5);
            irc.say(channel, toSay);
            break;
        case '!emotecache':
            emotecache.fetchEmotesFromBttv(function() {
                emotecache.cacheEmotes();
            });
            break;
        case '!channelcache':
            irc.channelCache();
            break;
        case '!configcache':
            config.cacheConfig();
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
            break;
        case 'config':
            configController(channel, username, message);
            break;
        case 'rejoin':
            irc.updateChannelJoins();
            break;
        case 'join':
            joinChannel(channel, username, message);
            break;
        case 'part':
            partChannel(channel, username, message);
            break;
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
                irc.whisper(username, 'added ' + trusted + ' to trusted');
                break;
            case 'remove':
                config.removeTrusted(channel, trusted);
                irc.whisper(username, 'removed ' + trusted + ' from trusted');
                break;
        }
    }

    function joinChannel(channel, username, message) {
        if (fn.countWords(message) < 3) {
            return false;
        }
        var silent     = false;
        var chanToJoin = fn.getNthWord(message, 3);

        if (fn.countWords(message) < 4) {
            if (fn.getNthWord(message, 4) == 'silent') {
                silent = true;
            }
        }
        irc.joinChannel(chanToJoin, silent);
    }

    function partChannel(channel, username, message) {
        if (fn.countWords(message) < 3) {
            return false;
        }
        var chanToPart = fn.getNthWord(message, 3);
        irc.partChannel(chanToPart);
    }
}

function configController(channel, username, message) {
    if (fn.countWords(message) < 4) {
        return false;
    }

    var option = fn.getNthWord(message, 3);
    var value = fn.getNthWord(message, 4);
    config.setConfig(channel, option, value, function(message) {
        irc.whisper(username, message);
    });
}


function commandsController(channel, username, message)
{
    if (fn.countWords(message) === 1) {
        return false;
    }

    var messageArr     = message.split(' ');
    var response       = false;
    var command        = messageArr[1].toLowerCase() || '';
    var commandName    = messageArr[2] || '';

    if (command === 'add') {
        var commandMessage = message.substr(12);
            commandMessage = commandMessage.replace(commandName, '');

        if (commandName.substr(0,1) != '!') {
            commandName = '!' + commandName;
        }
        if (commandMessage.indexOf('--response') > -1) {
            response = true;
            commandMessage = commandMessage.replace('--response', '');
        }
        var cooldown = 5;
        if (commandMessage.indexOf('--cd') > -1) {
            var index      = commandMessage.indexOf('--cd');
            cooldown       = commandMessage.substr(index+5, 7);
            commandMessage = commandMessage.replace('--cd', '');
            commandMessage = commandMessage.replace(cooldown, '');
        }
        addCommand(username, channel, commandName, commandMessage, response, cooldown);
    }
    else if (command === 'remove') {
        if (commandName === '') {
            return false;
        }
        removeCommand(username, channel, commandName);
    }
}

function addCommand(username, channel, command, message, response, cooldown) {
    var commandObj = {
        command: command,
        message: message,
        description: '',
        enabled: true,
        response: response,
        cooldown: cooldown
    }
    config.setCommand(channel, commandObj);
    irc.whisper(username, 'added command ' + commandObj.command);
}

function removeCommand(username, channel, command) {
    if (command.substr(0,1) != '!') {
        command = '!' + command;
    }
    config.removeCommand(channel, command);
    irc.whisper(username, 'removed command ' + command);
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
