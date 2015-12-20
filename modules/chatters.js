var output  = require('./twitch/output');
var fn      = require('./functions');
var fs 	    = require('graceful-fs');
var request = require('request');

function getStaff(channel, username, message)
{
	if (!(message.toLowerCase() === '!chatters staff')) {
		return false;
	}

	var channelSub = channel.substr(1);
	var chattersJsonURL = 'https://tmi.twitch.tv/group/user/' + channelSub + '/chatters';

	request(chattersJsonURL, function (error, response, body) {
		console.log('[GET] ' + chattersJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var staff = obj.chatters.staff;
	    	output.say(channel, 'current staff in chat: ' + staff);
	  	} 
	});
}

module.exports = 
{
	getStaff
}