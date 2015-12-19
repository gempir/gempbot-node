var output  = require('./twitch/output');
var fn      = require('./functions');
var fs 	    = require('graceful-fs');
var request = require('request');

function getFollowage(channel, username, message)
{
	if (message.toLowerCase() === '!followage') {
		getChannelFollowage(channel, username, message);
		return null;
	}

	var following = fn.getNthWord(message, 2); 
	var channelSub = channel.substr(1);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ following +'&name=' + username;

	if (fn.stringContainsUrl(following) || fn.stringIsLongerThan(following, 50)) {
	  		return false;
	}

	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);
	  	if (!error && response.statusCode == 200) {
	  		output.say(channel, username + ' has been following ' + following + ' ' + body.toString());
	  	} 
	  	else {
	  		output.say(channel, username + ' is not following ' + following + ' or the channel doesn\'t exist');
	  		return false;
	  	}

	});
	

}

function getChannelFollowage(channel, username, message)
{
	var channelSub = channel.substr(1);
	var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + username;


	request(followURL, function (error, response, body) {
		console.log('[GET] ' + followURL);
	  	if (!error && response.statusCode == 200) {
	    	output.say(channel, username + ' has been following ' + channelSub + ' ' + body.toString());
	  	} 
	  	else {
	  		output.say(channel, username + ' is not following ' + channelSub + ' or the channel doesn\'t exist');
	  		return false;
	  	}

	});
}


module.exports = 
{
	getFollowage
}