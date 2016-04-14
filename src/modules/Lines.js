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
            this.bot.redis.hget(channel + ":linecount", linesFor, (err, obj) => {
                this.bot.say(channel, `${prefix}${linesFor} has written a total of ${obj} lines`);
            });
        }
        else if (args.length === 1 && args[0] === 'channel') {
            this.bot.redis.hget(channel + ":linecount", 'channel', (err, obj) => {
                this.bot.say(channel, `${prefix} chat has written a total of ${obj} lines`)
            });
        }
        else {
            linesFor = args[0];
            this.bot.redis.hget(channel + ":linecount", linesFor, (err, obj) => {
                this.bot.say(channel, `${prefix}${linesFor} has written a total of ${obj} lines`);
            });
        }
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
