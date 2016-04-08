import lib from './../lib';

export default class Chatters {

	constructor(bot)
	{
		this.bot = bot;
		this.chatters = {};
	}

	recordChatters(channel, username)
	{
		if (typeof this.chatters[channel] === 'undefined') {
			this.chatters[channel] = [];
		}
		if (this.chatters[channel].indexOf(username) > -1 || this.bot.name === username) {
			return;
		};

		this.chatters[channel].push(username);

		try {
			setTimeout(() => {
				lib.removeFromArray(this.chatters[channel], username);
			}, 900000);
		} catch (err) {
			console.log(err);
		}

	}

	getChatters(channel, prefix)
	{
		this.bot.say(channel, prefix + this.chatters[channel].length + ' chatters active in the last 15mins');
	}
}
