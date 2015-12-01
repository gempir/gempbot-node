var channelModule = require('./channel');
var whisperModule = require('./whisper');

chat = channelModule.client;
group = whisperModule.bot;

function say(channel, message, action)
{
	action = action || false;

	if (global.cooldown) {
		return false;
	}

	if (!action) {
		global.cooldown = true;
		chat.say(channel, message);
		console.log('[OUTPUT] ' + message);
	}
	else if (action) {
		global.cooldown = true;
		chat.action(channel, message);
		console.log('[OUTPUT]' + '/me ' + message);
	}
}


function whisper(channel, message)
{
	group.say(channel, '.w ' + channel + ' ' + message);
	console.log('[OUTPUT] ' + '/w ' + channel + ' ' + message)
}

module.exports = 
{
	say,
	whisper
}