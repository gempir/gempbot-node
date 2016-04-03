import fs      from 'fs';
import moment  from 'moment';
import lib     from './../lib';
import cfg     from './../../cfg';
import request from 'request';



export default class Oddshots {
    constructor(bot)
    {
        this.bot  = bot;
    }

    saveChannelOddshots(channel, username, message)
    {
        var oddshotChannel = channel.substr(1);

        if (channel.indexOf('_') > -1) {
            var channelSplit = channel.substr(1).split('_');
            oddshotChannel = channelSplit[0] + '-' + channelSplit[1];
        }

        if (message.indexOf('oddshot.tv/shot/' + oddshotChannel) > -1) {
            try {
                this.parseOddshots(channel, username, message);
            } catch (err) {
                console.log(err);
            }
        }
    }

    parseOddshots(channel, username, message)
    {
        message = ' ' + message;
        console.log("parsing Oddshots: ", channel, username, message);
        var file = this.logs + channel.substr(1) + '/oddshots.txt';
        var messageSplit = message.split(' ');

        for (var i = 0; i < (messageSplit.length -1); i++) {
            if (messageSplit[i].indexOf('oddshot.tv/shot/') < 0) {
                continue;
            }

            request(messageSplit[i], function (error, response, body) {
                if (error || response.statusCode != 200) {
                    console.log('[oddshots]', error, response);
                    return;
                }
                console.log('[oddshots] inserting oddshot ' + messageSplit[i]);
                var timestamp =  moment.utc().format("YYYY-MM-DD HH:mm:ss");
                this.bot.mysql.query("INSERT INTO oddshots (channel, timestamp, url) VALUES (?, ?, ?)", [channel, timestamp, messageSplit[i]], function(err, results) {
                    if (err) {
                        console.log('[mysql] '+ err);
                    }
                });
            });
        }

    }

    getOddshots(channel, username, prefix)
    {
        this.bot.mysql.query("SELECT DATE_FORMAT(timestamp,'%Y-%m-%d %T') as timestamp, url FROM oddshots WHERE channel = ? ORDER BY timestamp DESC LIMIT 50", [channel], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            var log = '';
            for (var i = 0; i < results.length; i++) {
                log += '[' + results[i].timestamp + '] ' + results[i].url + '\r\n';
            }

            try {
                cfg.pastebin.createPaste(log, 'last 50 oddshots found in ' +  channel,null,3, '10M')
                    .then((data) => {
                        console.log('Pastebin created: ' + data);
                        this.bot.whisper(username, prefix + 'last 50 oddshots found in ' + channel + ' pastebin.com/' + data);
                    })
                    .fail(function (err) {
                        console.log(channel, err);
                    });
            } catch (err) {
                console.log(err);
            }
        });
    }
}
