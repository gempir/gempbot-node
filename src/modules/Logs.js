import cfg     from './../../cfg.js';
import moment  from 'moment';
import lib     from './../lib';
import request from 'request';

export default class Logs
{
    constructor(bot)
    {
        this.bot       = bot;
        this.counter   = 0;
    }

    getRandomquoteForUsername(channel, username, prefix)
    {
        if (this.counter > 10) {
            return;
        }
        var apiChannel = channel.substr(1);
        username = username.toLowerCase();
        var randomquoteURL = `https://api.gempir.com/channel/${apiChannel}/user/${username}/random`
        request(randomquoteURL, (error, response, body) => {
			console.log('[GET] ' + randomquoteURL);
			if (!error && response.statusCode == 200) {
				var quote = body.toString();

                if (this.bot.filters.isLink(quote) || this.bot.filters.isASCII(quote)) {
                    this.getRandomquoteForUsername(channel, username, prefix);
                    this.counter++;
                    return;
                }
                if (quote.length > 120) {
                    quote = quote.substring(0, 120) + ' [...]';
                }
                this.counter = 0;
				this.bot.say(channel, `${quote}`);
			}
		});
    }

    getLastMessage(channel, username)
    {
        var lastmessageURL = `https://api.gempir.com/user/${username}/last`
        request(lastmessageURL, (error, response, body) => {
			console.log('[GET] ' + lastmessageURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				var duration = json.duration;
                var message  = json.message;
                var lastchannel = json.channel;

                if (this.bot.filters.isLink(message) || this.bot.filters.isASCII(message)) {
                    this.bot.say(channel, `no message found for ${username} or the message contained a link or ASCII`);
                    return;
                }
                if (message.length > 120) {
                    message = message.substring(0, 120) + ' [...]';
                }
                if (duration == "") {
                    duration = "0 secs ";
                }

				this.bot.say(channel, `${lastchannel} | ${username}: ${message} | ${duration} ago`);
			} else {
                this.bot.say(channel, `no message found for ${username} or the message contained a link or ASCII`);
            }
		});
    }

    getLogs(channel, username, args, prefix)
    {
        var logsFor = args[0] || username;
        var logChannel = channel.substr(1);
        var year   = new Date().getFullYear()
        var month  = '';

        args.forEach((arg) => {
            if (arg.startsWith('--month-')) {
                month = arg.replace('--month-', '');
            }
            if (arg.startsWith('--year-')) {
                year = arg.replace('--year-', '')
            }
            if (arg.startsWith('--channel-')) {
                logChannel = arg.replace('--channel-', '');
            }
        });

        if (month === '') {
            this.bot.whisper(
                username,
                `messages for ${logsFor} in ${logChannel} for this month https://api.gempir.com/channel/${logChannel}/user/${logsFor}`
            )
        }
        else {
            this.bot.whisper(
                username,
                `messages for ${logsFor} in ${logChannel} from ${month}, ${year} https://api.gempir.com/channel/${logChannel}/user/${logsFor}/${year}/${month}`
            )
        }
    }
}
