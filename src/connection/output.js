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

function sayCommand(channel, message, action, command)
{
	action = action || false;

	if (cooldowns.indexOf(channel) > -1) {
		return false;
	}
    if (typeof commandCooldowns.channel != 'undefined') {
        if (commandCooldowns.channel.indexOf(command.command) > -1) {
            return false;
        }
    }
    
	if (!action) {
        setCooldown(channel, command.command, command.cooldown);
		chat.say(channel, message);
		console.log('[COMMAND] ' + message);

	}
	else if (action) {
        setCooldown(channel, command.command, command.cooldown);
		chat.action(channel, message);
		console.log('[COMMAND]' + '/me ' + message);
	}
}

function constructObjectArray(object, key)
{
    if (typeof object.key === 'undefined') {
        object.key = [];
    }
    return object;
}


function setCooldown(channel, command, time)
{
    constructObjectArray(commandCooldowns, channel);
    commandCooldowns[channel].push(command);
    setTimeout(function(){
        fn.removeFromArray(coammandsCooldowns.channel, command);
    }, time*1000);
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
		console.log('[SAY NoCD]' + '/me ' + message);
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
    cooldowns,
    sayCommand
}
