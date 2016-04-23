import request from 'request';

export default class Lines
{
    constructor(bot)
    {
        this.bot          = bot;
        this.lines        = {};
        this.saveLines();
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

    recordLines(channel, username, message)
    {
        if (typeof this.lines[channel] === 'undefined') {
            this.lines[channel] = {};
        }
        if (typeof this.lines[channel][username] === 'undefined') {
            this.lines[channel][username] = 0;
        }
        if (typeof this.lines[channel]['channel'] === 'undefined') {
            this.lines[channel]['channel'] = 0;
        }
        this.lines[channel]['channel']++;
        this.lines[channel][username]++;
    }

    saveLines() {
        setInterval(() => {
            for (var channel in this.lines) {
                for (var username in this.lines[channel]) {
                    var inc = this.lines[channel][username];
                    this.bot.redis.hincrby(`${channel}:linecount`, username, inc);
                    this.lines[channel][username] = 0;
                }
            }
        }, 3000);
    }
}
