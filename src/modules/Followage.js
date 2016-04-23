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
		var followURL = `https://api.gempir.com/twitch/followage/channel/${channelSub}/user/${arg}`;

		if (this.bot.filters.isLink(arg) || arg.length > 30) {
				return;
		}

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				var duration = json.duration;

				this.bot.say(channel, `${prefix}${arg} has been following ${channelSub} ${duration}`);
			}
			else {
				this.bot.say(channel, `${prefix}${arg} is not following ${channelSub}`);
			}

		});
	}

	getLocalFollowage(channel, username, prefix)
	{
		var channelSub = channel.substr(1);
		var followURL = `https://api.gempir.com/twitch/followage/channel/${channelSub}/user/${username}`;

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);;
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				var duration = json.duration;

				this.bot.say(channel, `${prefix}${username} has been following ${channelSub} ${duration}`);
			}
			else {
				this.bot.say(channel,  `${prefix}${username} is not following ${channelSub}`);
			}
		});
	}

	getUserChannelFollowage(channel, username, arg1, arg2, prefix)
	{
		var followURL = `https://api.gempir.com/twitch/followage/channel/${arg2}/user/${arg1}`;

		if (this.bot.filters.isLink(arg2) || arg2.length > 30 || this.bot.filters.isLink(arg1) || arg1.length > 30) {
				return;
		}

		request(followURL, (error, response, body) => {
			console.log('[GET] ' + followURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				var duration = json.duration;

				this.bot.say(channel, `${prefix}${arg1} has been following ${arg2} ${duration}`);
			}
			else {
				this.bot.say(channel, `${prefix}${arg1} is not following ${arg2}`);
			}

		});
	}
}
