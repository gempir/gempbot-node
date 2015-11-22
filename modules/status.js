var twitch = require('./twitch');
var cfg = require('../cfg');
var fn = require('./functions');

var client = twitch.client;



String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

client.on('chat', function (channel, user, message, self) {
   if (user["username"] === cfg.admin || user["user-type"] === "mod" ) {
        if (message.toLowerCase() === '!status') {
            var time = process.uptime();
    		var uptime = (time + "").toHHMMSS();
            client.say(channel, 'bot uptime: ' + uptime);
        }
   }
});

client.on('chat', function (channel, user, message, self) {
	var messageStart = message.substr(0,12).toLowerCase();
	var name = fn.getNthWord(message, 3);
    if (messageStart === '!status logs' && name != undefined && global.cooldown === false) {
		name = name.toLowerCase();
		if (!fn.fileExists('logs/' + channel.substr(1) + '/' + name +  '.txt')) {
        	
			if (fn.stringIsLongerThan(name, 20)) {
				name = 'the user';
			}
        	client.say(channel, user['username'] + ', ' + name + ' has no log here');        
        }
        else {
			if (name === 'channel') {
				var fileSize = fn.getFilesizeInKilobytes('logs/' + channel.substr(1) + '.txt').toFixed(0);
				var extension = ' KB';
				if (fileSize > 1000) {
					fileSize = fn.getFilesizeInMegabytes('logs/' + channel.substr(1) + '.txt').toFixed(2);
					extension = ' MB';
				}
				client.say(channel, '@' + user['username'] + ', ' + 'log file for channel ' + channel.substr(1) + ' is ' + fileSize + extension);
	        	global.cooldown = true;
			}
			else {
				var fileSize = fn.getFilesizeInKilobytes('logs/' + channel.substr(1) + '/' + name +  '.txt').toFixed(0);
				var extension = ' KB';
				if (fileSize > 1000) {
					fileSize = fn.getFilesizeInMegabytes('logs/' + channel.substr(1) + '/' + name +  '.txt').toFixed(2);
					extension = ' MB';
				}
				client.say(channel, '@' + user['username'] + ', ' + 'log file for ' + name + ' is ' + fileSize + extension);
				global.cooldown = true;
			}
		}
    }
});