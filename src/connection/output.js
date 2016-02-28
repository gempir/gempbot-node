var channelModule = require('./channel');
var whisperModule = require('./whisper');
var cfg           = require('./../../cfg');
var fn            = require('./../controllers/functions');

var chat = channelModule.client;
var group = whisperModule.group;

var commandCooldowns = {};
var userCooldowns = [];

function sayAllChannels(message, action)
{
    action = action || false;
    var channels = cfg.options.channels;

    for (var i = 0; i < channels.length; i++) {
        if (action) {
            chat.action(channels[i], message);
        }
        else {
            chat.say(channels[i], message);
        }
    }
    console.log('[GLOBAL][SAY] ' + message);
}

function say(channel, message, action)
{
	action = action || false;

	if (!action) {
		chat.say(channel, message);
		console.log('[SAY] ' + message);
	}
	else if (action) {
		chat.action(channel, message);
		console.log('[SAY]' + '/me ' + message);
	}
}

function sayCommand(channel, username, response, commObj)
{
    if (userCooldowns.indexOf(username.toLowerCase()) > -1) {
        return false;
    }

    if (typeof commandCooldowns[channel] === 'undefined') {
        commandCooldowns[channel] = [];
    }

    if (commandCooldowns[channel].indexOf(commObj.command) > -1) {
        console.log('[COMMAND] ' + commObj['command'] + ' cooldown');
        return false;
    }
    if (commObj.response) {
        response.message = '@' + username + ', ' + response.message;
    }

	chat.say(channel, response.message);
	console.log('[COMMAND] ' + response.message);

    commandCooldowns[channel].push(commObj.command);
    setTimeout(function(){
        fn.removeFromArray(commandCooldowns[channel], commObj.command);
    }, commObj['cooldown'] * 1000);

    userCooldowns.push(username.toLowerCase());
    setTimeout(function(){
        fn.removeFromArray(userCooldowns, username.toLowerCase());
    }, 2000);
}

function sayNoCD(channel, message, action)
{
	action = action || false;

	if (!action) {
		chat.say(channel, message);
		console.log('[SAY NoCD] ' + message);
	}
	else if (action) {
		chat.action(channel, message);
		console.log('[SAY NoCD] ' + '/me ' + message);
	}
}


function whisper(username, message)
{
	group.whisper(username, message);
	console.log('[WHISPER] ' + '/w ' + username + ' ' + message)
}

module.exports =
{
	say,
	sayNoCD,
    sayCommand,
    whisper,
    sayAllChannels,
    commandCooldowns,
    userCooldowns
}
