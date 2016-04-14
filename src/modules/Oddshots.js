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
        if (channel.includes('_')) {
            var channelSplit = channel.substr(1).split('_');
            oddshotChannel = channelSplit[0] + '-' + channelSplit[1];
        }

        if (message.includes(`oddshot.tv/shot/${oddshotChannel}`)) {
            try {
                this.parseOddshots(channel, username, message);
            } catch (err) {
                console.log(err);
            }
        }
    }

    parseOddshots(channel, username, message)
    {
        var messageSplit = message.split(' ');

        for (var i = 0; i < messageSplit.length; i++) {
            var isLink = this.bot.filters.isLink(messageSplit[i]);
            if (!isLink) {
                continue;
            }
            var url = messageSplit[i];
            console.log(`[oddshots] inserting oddshot ${url}`);
            var timestamp =  moment.utc().format("X");
            this.bot.redis.hset(`${channel}:oddshots`, timestamp, url)
        }

    }

    getOddshots(channel, username, prefix)
    {
        this.bot.redis.hgetall(`${channel}:oddshots`, (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            var log = '';
            for (var shot in results) {
                log += `[${moment.unix(shot).format("YYYY-MM-DD HH:mm:ss")}] ${results[shot]}`
            }
            try {
                cfg.pastebin.createPaste(log, `last oddshots found in ${channel}`,null,3, '10M')
                    .then((data) => {
                        console.log('Pastebin created: ' + data);
                        this.bot.whisper(username, `${prefix} last oddshots found in ${channel} pastebin.com/${data}`);
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
