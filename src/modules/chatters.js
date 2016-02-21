var output       = require('./../connection/output');
var fn           = require('./../controllers/functions');
var fs 	         = require('fs');
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
	}
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
