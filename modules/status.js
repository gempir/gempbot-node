var twitch = require('./twitch');
var cfg = require('../cfg');
var fn = require('./functions');

var client = twitch.client;

client.on('chat', function (channel, user, message, self) {
   if (user["username"] === cfg.admin || user["user-type"] === "mod" ) {
        if (message.toLowerCase() === '!status') {
            client.say(channel, '@' + user['username'] + ', ' + 'active in: ' + cfg.options.channels);
        }
   }
});


client.on('chat', function (channel, user, message, self) {
	var messageStart = message.substr(0,12).toLowerCase();
    if (messageStart === '!status logs' && global.cooldown === false) {
		var name = fn.getNthWord(message, 3).toLowerCase();
		var fileSize = 0;
		console.log(name);


		if (name === 'channel') {
			if ((fn.getFilesizeInKilobytes('logs/' + channel.substr(1) + '.txt').toFixed(2) + ' KB') > 1000) {
				fileSize = fn.getFilesizeInMegabytes('logs/' + channel.substr(1) + '.txt').toFixed(2) + ' MB');
			}
			client.say(channel, '@' + user['username'] + ', ' + 'log file for channel ' + channel.substr(1) + ' is ' + fileSize);
        	global.cooldown = true;
		}
		else {
			if ((fn.getFilesizeInKilobytes('logs/' + channel.substr(1) + '/' + name +  '.txt').toFixed(2) + ' KB') > 1000) {
				fileSize = fn.getFilesizeInMegabytes('logs/' + channel.substr(1) + '/' + name +  '.txt').toFixed(2) + ' MB');
			}
			client.say(channel, '@' + user['username'] + ', ' + 'log file for ' + name + ' is ' + fileSize);
			global.cooldown = true;
		}
    }
});