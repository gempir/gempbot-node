import fn from './../controllers/functions';
import request from 'request';

export default class Followage
{
	constructor(bot)
	{
		this.bot = bot;
	}

	followageCommandHandler(channel, username, args, prefix) {
		if (args.length === 0) {
			this.getLocalFollowage(channel, username, prefix);
		}
		else if (args.length === 1) {
			this.getUserLocalFollowage(channel, username, args[0], prefix);
		}
		else if (args.length >= 2) {
			this.getUserChannelFollowage(channel, username, args[0], args[1], prefix);
		}
	}

	getUserLocalFollowage(channel, username, arg, prefix)
	{
		var channelSub = channel.substr(1);
		var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + arg;

		if (fn.stringContainsUrl(arg) || fn.stringIsLongerThan(arg, 30)) {
				return false;
		}

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);
			if (!error && response.statusCode == 200) {
				this.bot.say(channel, prefix + arg + ' has been following ' + channelSub + ' ' + body.toString());
			}
			else {
				this.bot.say(channel, prefix + arg + ' is not following ' + channelSub + ' or the channel doesn\'t exist');
			}

		});
	}

	getLocalFollowage(channel, username, prefix)
	{
		var channelSub = channel.substr(1);
		var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ channelSub +'&name=' + username;

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);;
			if (!error && response.statusCode == 200) {
				this.bot.say(channel, prefix + username + ' has been following ' + channelSub + ' ' + body.toString());
			}
			else {
				this.bot.say(channel, prefix + username + ' is not following ' + channelSub + ' or the channel doesn\'t exist');
			}
		});
	}

	getUserChannelFollowage(channel, username, arg1, arg2, prefix)
	{
		var followURL = 'https://api.rtainc.co/twitch/followers/length?channel='+ arg2 +'&name=' + arg1;

		if (fn.stringContainsUrl(arg2) || fn.stringIsLongerThan(arg2, 30)) {
				return false;
		}

		if (fn.stringContainsUrl(arg1) || fn.stringIsLongerThan(arg1, 30)) {
				return false;
		}

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);
			if (!error && response.statusCode == 200) {
				this.bot.say(channel, prefix + arg1 + ' has been following ' + arg2 + ' ' + body.toString());
			}
			else {
				this.bot.say(channel, prefix + arg1 + ' is not following ' + arg2 + ' or the channel doesn\'t exist');
			}

		});
	}
}
