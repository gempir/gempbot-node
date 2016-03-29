
import fn from './../controllers/functions';

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
            this.bot.models.redis.hget(channel + ":linecount", linesFor, (err, obj) => {
                this.bot.say(channel, prefix + linesFor + ' has written a total of ' + obj + ' lines');
            });
        }
        else if (args.length === 1 && args[0] === 'channel') {
            this.bot.models.redis.hget(channel + ":linecount", 'channel', (err, obj) => {
                this.bot.say(channel, prefix + 'chat has written a total of ' + obj + ' lines')
            });
        }
        else {
            linesFor = args[0];
            this.bot.models.redis.hget(channel + ":linecount", linesFor, (err, obj) => {
                this.bot.say(channel, prefix + linesFor + ' has written a total of ' + obj + ' lines');
            });
        }
    }

    recordLines(channel, username, message)
    {
        this.bot.models.redis.hincrby(channel + ':linecount', 'channel', 1);
        this.bot.models.redis.hincrby(channel + ':linecount', username, 1);
    }
}
