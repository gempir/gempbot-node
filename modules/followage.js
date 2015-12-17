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
	var followJsonURL = 'https://api.twitch.tv/kraken/users/'+ username +'/follows/channels/' + following;
	
	if (fn.stringContainsUrl(following) || fn.stringIsLongerThan(following, 50)) {
	  		return false;
	}

	request(followJsonURL, function (error, response, body) {
		console.log('[GET] ' + followJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var followage = obj.created_at.substr(0,10);
	    	output.say(channel, username + ' has been following ' + following + ' since ' + followage);
	  } 
	  else {
	  	output.say(channel, username + ' is not following ' + following + ' or the channel doesn\'t exit');
	    console.log("[GET] API ERROR: ", error, ", status code: ", response.statusCode);
	  }
	});
	

}

function getChannelFollowage(channel, username, message)
{
	var channelSub = channel.substr(1);
	var followJsonURL = 'https://api.twitch.tv/kraken/users/'+ username +'/follows/channels/' + channelSub;
	request(followJsonURL, function (error, response, body) {
		console.log('[GET] ' + followJsonURL);
	  	if (!error && response.statusCode == 200) {
	    	var obj = JSON.parse(body);
	    	var followage = obj.created_at.substr(0,10);
	    	output.say(channel, username + ' has been following ' + channelSub + ' since ' + followage);
	  } 
	  else {
	  	output.say(channel, username + ' is not following ' + channelSub);
	    console.log("[GET] API ERROR: ", error, ", status code: ", response.statusCode);
	  }
	});
}


module.exports = 
{
	getFollowage
}