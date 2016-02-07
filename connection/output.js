var channelModule = require('./channel');
var whisperModule = require('./whisper');
var cfg           = require('./../cfg');
var colors        = require('colors');
var fn            = require('./../modules/functions');

var chat = channelModule.client;
var group = whisperModule.group;

var cooldowns = [];

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
    console.log(('[GLOBAL][SAY] ' + message).bgBlue.white);
}

function say(channel, message, action)
{
	action = action || false;

	if (cooldowns.indexOf(channel) > -1) {
		return false;
	}

	if (!action) {
		cooldowns.push(channel);
		chat.say(channel, message);
		console.log(('[SAY] ' + message).yellow);
        setTimeout(function(){
            fn.removeFromArray(cooldowns, channel);
        }, cfg.globalcooldown);
	}
	else if (action) {
		cooldowns.push(channel);
		chat.action(channel, message);
		console.log(('[SAY]' + '/me ' + message).yellow);
        setTimeout(function(){
            fn.removeFromArray(cooldowns, channel);
        }, cfg.globalcooldown);
	}
}

function sayNoCD(channel, message, action)
{
	action = action || false;

	if (!action) {
		chat.say(channel, message);
		console.log(('[SAY NoCD] ' + message).magenta);
	}
	else if (action) {
		chat.action(channel, message);
		console.log(('[SAY NoCD]' + '/me ' + message).magenta);
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
	whisper,
    sayAllChannels,
    cooldowns
}
