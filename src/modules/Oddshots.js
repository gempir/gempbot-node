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
        var messageSplit = message.split(' ');

        for (var i = 0; i < messageSplit.length; i++) {
            var isLink = this.bot.filters.isLink(messageSplit[i]);
            if (!isLink) {
                continue;
            }
            var url = messageSplit[i];
            console.log('[oddshots] found oddshot ' + url);
            if (url.indexOf('http://') < 0 || url.indexOf('https://') < 0) {
                url = 'http://' + url;
            }
            console.log('[oddshots] inserting oddshot ' + url);
            var timestamp =  moment.utc().format("YYYY-MM-DD HH:mm:ss");
            this.bot.mysql.query("INSERT INTO oddshots (channel, timestamp, url) VALUES (?, ?, ?)", [channel, timestamp, url], function(err, results) {
                if (err) {
                    console.log('[mysql] '+ err);
                }
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
