
import fn from './../controllers/functions';

export default class Lines
{
    constructor(bot)
    {
        this.bot          = bot;
        this.channelLines = {};
        this.saveLines();
    }

    saveLines()
    {
        setInterval(() => {
            for (var channel in this.channelLines) {
                this.bot.models.redis.hincrby(channel + ':linecount:channel', 'lines', this.channelLines[channel]);
                this.channelLines[channel] = 0;
            }
        }, 30000);
    }

    lineCount(channel, username, args, prefix)
    {
        if (args.length === 0) {
            var linesFor = username.toLowerCase();
            this.bot.models.redis.hget(channel + ":linecount:user", linesFor, (err, obj) => {
                this.bot.say(channel, prefix + linesFor + ' has written a total of ' + obj + ' lines');
            });
        }
        else if (args.length === 1 && args[0] === 'channel') {
            this.bot.models.redis.hget(channel + ":linecount:channel", 'lines', (err, obj) => {
                this.bot.say(channel, prefix + 'chat has written a total of ' + obj + ' lines')
            });
        }
        else {
            linesFor = args[0];
            this.bot.models.redis.hget(channel + ":linecount:user", linesFor, (err, obj) => {
                this.bot.say(channel, prefix + linesFor + ' has written a total of ' + obj + ' lines');
            });
        }
    }

    recordLines(channel, username, message)
    {
        if (typeof this.channelLines[channel] === 'undefined') {
            this.channelLines[channel] = 0;
        }
        this.channelLines[channel]++;
        this.bot.models.redis.hincrby(channel + ':linecount:user', username.toLowerCase(), 1);
    }
}
