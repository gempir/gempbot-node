var output  = require('./twitch/output');
var fn      = require('./functions');
var fs 	    = require('graceful-fs');
var request = require('request');


function chattersCommandHandler(channel, username, message, whisper)
{
	switch(message.toLowerCase()) {
		case '!chatters':
			getChatters(channel, username, message, whisper);
			break;
		case '!chatters staff':
			getStaff(channel, username, message, whisper);
			break;
		case '!chatters mods':
			getMods(channel, username, message, whisper);
			break;
	}
}


function getStaff(channel, username, message, whisper)
{
	var channelSub = channel.substr(1);
	var chattersJsonURL = 'https://tmi.twitch.tv/group/user/' + channelSub + '/chatters';

	request(chattersJsonURL, function (error, response, body) {
		console.log('[GET] ' + chattersJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var staff = obj.chatters.staff;

	    	if (staff.length === 0) {
	    		var response = 'there are no staff members in chat';
	    	}
	    	else {
	    		var response = 'current staff in chat: ' + staff;
	    	}
	    	if (whisper){
	    		output.whisper(username, response);
	    	}
	    	else {
	    		output.say(channel, '@' + username + ', ' + response);
	    	}
	  	} 
	});
}


function getMods(channel, username, message, whisper)
{
	if (!fn.isMod(channel, username)) {
		return false;
	}

	var channelSub = channel.substr(1);
	var chattersJsonURL = 'https://tmi.twitch.tv/group/user/' + channelSub + '/chatters';

	request(chattersJsonURL, function (error, response, body) {
		console.log('[GET] ' + chattersJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var mods = obj.chatters.moderators;

	    	if (mods.length === 0) {
	    		var response = 'there are no mods in chat';
	    	}
	    	else if (mods.length > 15) {
	    		var response = 'there are currently ' +  mods.length + ' mods in chat';
	    	}
	    	else {
	    		var response = 'current mods in chat: ' + mods;
	    	}
	    	if (whisper){
	    		output.whisper(username, response);
	    	}
	    	else {
	    		output.say(channel, '@' + username + ', ' + response);
	    	}
	  	} 
	});
}

function getChatters(channel, username, message, whisper)
{
	var channelSub = channel.substr(1);
	var chattersJsonURL = 'https://tmi.twitch.tv/group/user/' + channelSub + '/chatters';

	request(chattersJsonURL, function (error, response, body) {
		console.log('[GET] ' + chattersJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var chattersCount = obj.chatter_count;
	    	var response = 'there are currently ' + chattersCount + ' chatters';
	    	if (whisper){
	    		output.whisper(username, response);
	    	}
	    	else {
	    		output.say(channel, '@' + username + ', ' + response);
	    	}
	  	} 
	});
}

module.exports = 
{
	chattersCommandHandler
}