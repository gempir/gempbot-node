var output  = require('./../connection/output');
var fn      = require('./../controllers/functions');
var fs 	    = require('fs');
var request = require('request');


function followageCommandHandler(channel, username, message, callback) {
	if (message.toLowerCase() === '!followage') {
		getLocalFollowage(channel, username, message, function(response){
			return callback(response);
		});
	}
	else if (fn.countWords(message) === 2) {
		getUserLocalFollowage(channel, username, message, function(response) {
			return callback(response);
		});
	}
	else if (fn.countWords(message) >= 3) {
		getUserChannelFollowage(channel, username, message, function(response) {
			return callback(response);
		});
	}
}


function getUserLocalFollowage(channel, username, message, callback)
{
	var following = fn.getNthWord(message, 2);
	var channelSub = channel.substr(1);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + following;

	if (fn.stringContainsUrl(following) || fn.stringIsLongerThan(following, 30)) {
	  		return false;
	}

	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);
	  	if (!error && response.statusCode == 200) {
	  		return callback({
				channel: channel,
				message: following + ' has been following ' + channelSub + ' ' + body.toString()
			});
	  	}
	  	else {
	  		return callback({
				channel: channel,
				message: following + ' is not following ' + channelSub + ' or the channel doesn\'t exist'
			});
	  	}

	});
}

function getLocalFollowage(channel, username, message, callback)
{
	var channelSub = channel.substr(1);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + username;

	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);;
	  	if (!error && response.statusCode == 200) {
    		return callback({
				channel: channel,
				message: username + ' has been following ' + channelSub + ' ' + body.toString()
			});
	  	}
	  	else {
	  		return callback({
				channel: channel,
				message: username + ' is not following ' + channelSub + ' or the channel doesn\'t exist'
			});
	  		return false;
	  	}

	});
}

function getUserChannelFollowage(channel, username, message, callback)
{
	var following = fn.getNthWord(message, 3);
	var userFollow = fn.getNthWord(message, 2);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ following +'&name=' + userFollow;

	if (fn.stringContainsUrl(following) || fn.stringIsLongerThan(following, 30)) {
	  		return false;
	}

	if (fn.stringContainsUrl(userFollow) || fn.stringIsLongerThan(userFollow, 30)) {
	  		return false;
	}

	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);
	  	if (!error && response.statusCode == 200) {
	  		return callback({
				channel: channel,
				message: userFollow + ' has been following ' + following + ' ' + body.toString()
			});
	  	}
	  	else {
	  		return callback({
				channel: channel,
				message: userFollow + ' is not following ' + following + ' or the channel doesn\'t exist'
			});
	  	}

	});
}


module.exports =
{
	followageCommandHandler
}
