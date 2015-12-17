var output  = require('./twitch/output');
var fn      = require('./functions');
var fs 	    = require('graceful-fs');
var request = require('request');

function getFollowage(channel, username, message)
{
	var channelSub = channel.substr(1);
	var followJsonURL = 'https://api.twitch.tv/kraken/users/'+ username +'/follows/channels/' + channelSub;
	console.log('[GET] ' + followJsonURL);

	request(followJsonURL, function (error, response, body) {
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