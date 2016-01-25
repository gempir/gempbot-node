var output  = require('./../connection/output');
var fn      = require('./functions');
var fs 	    = require('graceful-fs');
var request = require('request');
var cfg     = require('./../cfg');


function recordChatters(channel, username, message)
{
	if (typeof global.chatters === 'undefined') {
		global.chatters = [];
	}

	var index = global.chatters.indexOf(username);
	if (index > -1) {
		return false;
	}
	global.chatters.push(username);

	setTimeout(function() {
		global.chatters.splice(index, 1);
	}, 900000);
}


function chattersCommandHandler(channel, username, message)
{
	switch(message.toLowerCase()) {
		case '!chatters':
			getChatters(channel, username, message);
			break;
		case '!chatters staff':
			getStaff(channel, username, message);
			break;
		case '!chatters mods':
			getMods(channel, username, message);
			break;
	}
}


function getStaff(channel, username, message)
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
	    	
            output.say(channel, '@' + username + ', ' + response);
	 	}
	});
}


function getMods(channel, username, message)
{
	if (!(global.trusted.indexOf(username) > -1)) {
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
	    
	    	output.say(channel, '@' + username + ', ' + response);	
	  	}
	});
}

function getChatters(channel, username, message)
{		
	output.say(channel, 'There were ' + global.chatters.length + ' chatters in the last 15mins');
}

module.exports =
{
	chattersCommandHandler,
	recordChatters
}
