import request from 'request';

export default class Lines
{
    constructor(bot)
    {
        this.bot          = bot;
    }

    lineCount(channel, username, args, prefix)
    {
        if (args.length === 0) {
            var linesFor = username.toLowerCase();
            this.getLinesFor(channel, linesFor, prefix)
        }
        else {
            linesFor = args[0].toLowerCase();
            this.getLinesFor(channel, linesFor, prefix)
        }
    }

    getLinesFor(channel, username, prefix) {
        var url = `https://api.gempir.com/user/${username}`
        request(url, (error, response, body) => {
			console.log('[GET] ' + url);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				this.bot.say(channel, `${prefix}${username} has written ${json.lines} lines`);
            }
		});
    }
}
