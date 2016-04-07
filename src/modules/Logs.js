import cfg    from './../../cfg.js';
import fs     from 'fs';
import moment from 'moment';
import lib     from './../lib';

export default class Logs
{
    constructor(bot)
    {
        this.bot       = bot;
    }

    getRandomquoteForUsername(channel, username, prefix)
    {
        this.bot.mysql.query("\
        SELECT  * \
        FROM    (\
                SELECT  @cnt := COUNT(*) + 1,\
                        @lim := 10\
                FROM    chatlogs\
            ) vars\
        STRAIGHT_JOIN\
                (\
                SELECT  r.*,\
                        @lim := @lim - 1\
                FROM    chatlogs r\
                WHERE   (@cnt := @cnt - 1)\
                        AND RAND() < @lim / @cnt\
                        AND channel = ?\
                        AND LENGTH(message) < 200\
                ) i\
        ", [username], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }

            for (var i = 0; i < results.length; i++) {
                var quote = results[i].message;
                var filters = this.bot.filters.evaluate(channel, quote)
                if (filters.length > 200 || filters.danger > 5 || filters.banphrase) {
                    console.log('[log] skipping quote');
                    continue;
                }
                this.bot.say(channel, prefix + username + ': ' + quote);
                break;
            }
        });
    }

    getRandomquote(channel, prefix)
    {
        this.bot.mysql.query("\
        SELECT  * \
        FROM    (\
                SELECT  @cnt := COUNT(*) + 1,\
                        @lim := 10\
                FROM    chatlogs\
            ) vars\
        STRAIGHT_JOIN\
                (\
                SELECT  r.*,\
                        @lim := @lim - 1\
                FROM    chatlogs r\
                WHERE   (@cnt := @cnt - 1)\
                        AND RAND() < @lim / @cnt\
                        AND channel = ?\
                        AND LENGTH(message) < 200\
                ) i\
        ", [channel], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            for (var i = 0; i < results.length; i++) {
                var quote = results[i].message;
                var filters = this.bot.filters.evaluate(channel, quote)
                if (filters.length > 200 || filters.danger > 5 || filters.banphrase) {
                    console.log('[log] skipping quote');
                    continue;
                }
                this.bot.say(channel, prefix + results[i].username + ': ' + quote);
                break;
            }
        });


    }

    getLastMessage(channel, username)
    {
        this.bot.mysql.query("SELECT channel, message FROM chatlogs WHERE username = ? ORDER BY timestamp DESC LIMIT 1", [username], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            var message = results[0].message;
            var filters = this.bot.filters.evaluate(channel, message);
            if (filters.length > 200 || filters.danger >= 20 || filters.banphrase) {
                return false;
            }
            if (message.length > 120) {
                message = message.substring(0, 120) + ' [...]';
            }
            this.bot.say(channel, results[0].channel + ' | ' + username + ': ' + message);
        });
    }

    getLogs(channel, username, logsFor, prefix)
    {
        this.bot.mysql.query("SELECT DATE_FORMAT(timestamp,'%Y-%m-%d %T') as timestamp, message FROM chatlogs WHERE username = ? AND channel = ? ORDER BY timestamp DESC LIMIT 500", [logsFor, channel], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            var log = '';
            for (var i = 0; i < results.length; i++) {
                log += '[' + results[i].timestamp + '] ' + logsFor + ': ' + results[i].message + '\r\n';
            }

            try {
                cfg.pastebin.createPaste(log, 'last 500 messages for ' +  logsFor + ' in ' + channel,null,3, '10M')
                    .then((data) => {
                        console.log('Pastebin created: ' + data);
                        this.bot.whisper(username, prefix + 'last 500 messages for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data);
                    })
                    .fail(function (err) {
                        console.log(channel, err);
                    });
            } catch (err) {
                console.log(err);
            }
        });
    }

    getLogsAll(username, logsFor, prefix)
    {
        this.bot.mysql.query("SELECT DATE_FORMAT(timestamp,'%Y-%m-%d %T') as timestamp, message, channel FROM chatlogs WHERE username = ? ORDER BY timestamp DESC LIMIT 500", [logsFor], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            var log = '';
            for (var i = 0; i < results.length; i++) {
                log += '[' + results[i].timestamp + '] ' + results[i].channel + ' | ' + logsFor + ': ' + results[i].message + '\r\n';
            }

            try {
                cfg.pastebin.createPaste(log, 'last 500 messages for ' +  logsFor,null,3, '10M')
                    .then((data) => {
                        console.log('Pastebin created: ' + data);
                        this.bot.whisper(username, prefix + 'last 500 messages for '+ logsFor + ' pastebin.com/' + data);
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
