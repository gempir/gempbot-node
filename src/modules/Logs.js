import cfg     from './../../cfg.js';
import fs      from 'fs';
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
        username = username.toLowerCase();
        var randomquoteURL = `https://api.gempir.com/v1/user/${username}/messages/random`
        request(randomquoteURL, (error, response, body) => {
			console.log('[GET] ' + randomquoteURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
                var message  = json.messages[0].message;

                if (this.bot.filters.isLink(message) || this.bot.filters.isASCII(message)) {
                    this.getRandomquoteForUsername(channel, username, prefix);
                    this.counter++;
                    return;
                }
                if (message.length > 120) {
                    message = message.substring(0, 120) + ' [...]';
                }
                this.counter = 0;
				this.bot.say(channel, username + ': ' + message);
			}
		});
    }

    getLastMessage(channel, username)
    {
        var lastmessageURL = `https://api.gempir.com/v1/user/${username}/messages/last/1`
        request(lastmessageURL, (error, response, body) => {
			console.log('[GET] ' + lastmessageURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());
				var duration = json.messages[0].duration;
                var message  = json.messages[0].message;
                var lastchannel = json.messages[0].channel;

                if (this.bot.filters.isLink(message) || this.bot.filters.isASCII(message)) {
                    return false;
                }
                if (message.length > 120) {
                    message = message.substring(0, 120) + ' [...]';
                }
                if (duration == "") {
                    duration = "0 secs ";
                }

				this.bot.say(channel, lastchannel + ' | ' + username + ': ' + message + ' | ' + duration + ' ago');
			}
		});
    }

    getLogs(channel, username, logsFor, prefix)
    {
        logsFor = logsFor.toLowerCase();
        channel = channel.substr(1);
        var logsURL = `https://api.gempir.com/v1/channel/${channel}/user/${logsFor}/messages/last/500`
        request(logsURL, (error, response, body) => {
			console.log('[GET] ' + logsURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());

                var uploadContent = "";

                json.messages.forEach((msg) => {
                    uploadContent += `[${msg.timestamp}] ${msg.username}: ${msg.message}\r\n`;
                });

                try {
                    cfg.pastebin.createPaste(uploadContent, 'last 500 messages for ' +  logsFor + ' in ' + channel + ' (UTC)',null,3, '10M')
                        .then((data) => {
                            console.log('Pastebin created: ' + data);
                            this.bot.whisper(username, prefix + 'last 500 messages for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data  + ' (UTC)');
                        })
                        .fail(function (err) {
                            console.log(channel, err);
                        });
                } catch (err) {
                    console.log(err);
                }
			} else {
                console.log(error, response.statusCode);
            }
		});
    }

    getLogsAll(username, logsFor, prefix)
    {
        logsFor = logsFor.toLowerCase();
        var logsURL = `https://api.gempir.com/v1/user/${logsFor}/messages/last/500`
        request(logsURL, (error, response, body) => {
			console.log('[GET] ' + logsURL);
			if (!error && response.statusCode == 200) {
				var json = JSON.parse(body.toString());

                var uploadContent = "";

                json.messages.forEach((msg) => {
                    uploadContent += `[${msg.timestamp}] [${msg.channel}] ${msg.username}: ${msg.message}\r\n`;
                });

                try {
                    cfg.pastebin.createPaste(uploadContent, 'last 500 messages for ' +  logsFor + ' (UTC)',null,3, '10M')
                        .then((data) => {
                            console.log('Pastebin created: ' + data);
                            this.bot.whisper(username, prefix + 'last 500 messages for '+ logsFor + ' pastebin.com/' + data + ' (UTC)');
                        })
                        .fail(function (err) {
                            console.log(channel, err);
                        });
                } catch (err) {
                    console.log(err);
                }
			} else {
                console.log(error, response.statusCode);
            }
		});
    }


}
