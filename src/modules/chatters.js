var output       = require('./../connection/output');
var fn           = require('./../controllers/functions');
var fs 	         = require('fs');
var request      = require('request');
var cfg          = require('./../../cfg');
var commandCache = require('./../models/commandcache');

var chatters = {};

function recordChatters(channel, username, message)
{
	if (typeof chatters[channel] === 'undefined') {
		chatters[channel] = [];
	}
	if (chatters[channel].indexOf(username) > -1) {
		return false;
	};

	chatters[channel].push(username);

	setTimeout(function() {
		fn.removeFromArray(chatters[channel], username);
	}, 900000);
}


function chattersCommandHandler(channel, username, message, callback)
{
	switch(message.toLowerCase()) {
		case '!chatters':
			getChatters(channel, username, message, function(response) {
				return callback(response);
			});
			break;
		case '!chatters staff':
			getStaff(channel, username, message, function(response) {
				return callback(response);
			});
			break;
		case '!chatters mods':
			getMods(channel, username, message, function(response) {
				return callback(response);
			});
			break;
	}
}


function getStaff(channel, username, message, callback)
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

            return callback({
				channel: channel,
				message: '@' + username + ', ' + response
			});
	 	}
	});
}


function getMods(channel, username, message, callback)
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

	    	return callback({
				channel: channel,
				message: '@' + username + ', ' + response
			});
	  	}
	});
}

function getChatters(channel, username, message, callback)
{
	return callback({
		channel: channel,
		message: 'There were ' + chatters[channel].length + ' chatters in the last 15mins'
	});
}

module.exports =
{
	chattersCommandHandler,
	recordChatters
}
