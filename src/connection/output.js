var channelModule = require('./channel');
var whisperModule = require('./whisper');
var cfg           = require('./../../cfg');
var fn            = require('./../controllers/functions');

var chat = channelModule.client;
var group = whisperModule.group;

var cooldowns        = [];
var commandCooldowns = {};

function sayAllChannels(message, action)
{
    if (cfg.silent.indexOf(channel) > -1 ) {
        return false;
    }
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
    if (cfg.silent.indexOf(channel) > -1 ) {
        return false;
    }
	action = action || false;

	if (cooldowns.indexOf(channel) > -1) {
		return false;
	}

	if (!action) {
		cooldowns.push(channel);
		chat.say(channel, message);
		console.log('[SAY] ' + message);
        setTimeout(function(){
            fn.removeFromArray(cooldowns, channel);
        }, cfg.globalcooldown);
	}
	else if (action) {
		cooldowns.push(channel);
		chat.action(channel, message);
		console.log('[SAY]' + '/me ' + message);
        setTimeout(function(){
            fn.removeFromArray(cooldowns, channel);
        }, cfg.globalcooldown);
	}
}

function sayCommand(channel, username, response, commObj)
{
    if (cfg.silent.indexOf(channel) > -1 ) {
        return false;
    }
	if (cooldowns.indexOf(channel) > -1) {
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

    setCooldown(channel, commObj.command, commObj['cooldown']);
	chat.say(channel, response.message);
	console.log('[COMMAND] ' + response.message);
}

function setCooldown(channel, command, time)
{
    commandCooldowns[channel].push(command);
    setTimeout(function(){
        fn.removeFromArray(commandCooldowns[channel], command);
    }, time * 1000);
}

function sayNoCD(channel, message, action)
{
    if (cfg.silent.indexOf(channel) > -1 ) {
        return false;
    }
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
    cooldowns,
    commandCooldowns
}
