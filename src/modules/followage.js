var output  = require('./../connection/output');
var fn      = require('./../controllers/functions');
var fs 	    = require('graceful-fs');
var request = require('request');


function followageCommandHandler(channel, username, message) {
	if (message.toLowerCase() === '!followage') {
		getLocalFollowage(channel, username, message)
		return;
	}
	if (fn.countWords(message) === 2) {
		getUserLocalFollowage(channel, username, message);
		return;
	}
	if (fn.countWords(message) >= 3) {
		getUserChannelFollowage(channel, username, message);
		return;
	}
}


function getUserLocalFollowage(channel, username, message)
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
	  		output.say(channel, '@' +  username + ', ' + following + ' has been following ' + channelSub + ' ' + body.toString());
	  	}
	  	else {
	  		output.say(channel, '@' + username  + ', ' + following + ' is not following ' + channelSub + ' or the channel doesn\'t exist');
	  		return false;
	  	}

	});
}

function getLocalFollowage(channel, username, message)
{
	var channelSub = channel.substr(1);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + username;

	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);;
	  	if (!error && response.statusCode == 200) {
    		output.say(channel, '@' + username + ', you have been following ' + channelSub + ' ' + body.toString());
	  	}
	  	else {
	  		output.say(channel, '@' + username + ', you are not following ' + channelSub + ' or the channel doesn\'t exist');
	  		return false;
	  	}

	});
}

function getUserChannelFollowage(channel, username, message)
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
	  		output.say(channel, '@' + username + ', ' + userFollow + ' has been following ' + following + ' ' + body.toString());
	  	}
	  	else {
	  		output.say(channel, '@' + username + ', ' + userFollow + ' is not following ' + following + ' or the channel doesn\'t exist');
	  		return false;
	  	}

	});
}


module.exports =
{
	followageCommandHandler
}