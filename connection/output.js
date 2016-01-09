var channelModule = require('./channel');
var whisperModule = require('./whisper');

	

chat = channelModule.client;
group = whisperModule.group;

function say(channel, message, action)
{
	action = action || false;

	if (global.cooldown) {
		return false;
	}

	if (!action) {
		global.cooldown = true;
		chat.say(channel, message);
		console.log('[SAY] ' + message);
	}
	else if (action) {
		global.cooldown = true;
		chat.action(channel, message);
		console.log('[SAY]' + '/me ' + message);
	}
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
	if (global.whisperCooldown) {
		return false;
	}
	global.whisperCooldown = true;
	group.whisper(username, message);
	console.log('[WHISPER] ' + '/w ' + username + ' ' + message)
}

module.exports = 
{
	say,
	sayNoCD,
	whisper
}