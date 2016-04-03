import cfg    from './../../cfg.js';
import fs     from 'fs';
import moment from 'moment';
import lib     from './../lib';

export default class Logs
{
    constructor(bot)
    {
        this.bot       = bot;
        this.logs      = __dirname +'/../../../logs/';
        this.date      = new Date();
        this.month     = [];
        this.month[0]  = "January";
        this.month[1]  = "February";
        this.month[2]  = "March";
        this.month[3]  = "April";
        this.month[4]  = "May";
        this.month[5]  = "June";
        this.month[6]  = "July";
        this.month[7]  = "August";
        this.month[8]  = "September";
        this.month[9]  = "October";
        this.month[10] = "November";
        this.month[11] = "December";

        if (!fs.existsSync(this.logs)){
            fs.mkdirSync(this.logs);
            console.log('[LOG] created folder: logs');
        }
    }

    getRandomquote(channel, username, prefix)
    {
        this.bot.mysql.query('SELECT message FROM chatlogs WHERE username = ? ORDER BY RAND() LIMIT 50', [username], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                var quote = results[i].message;
                var filters = this.bot.filters.evaluate(channel, quote)
                if (filters.length < 200 && filters.danger < 5 && !filters.banphrase) {
                    console.log('[log] skipping quote');
                    continue;
                }
                this.bot.say(channel, prefix + username + ' ' + quote);
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

    createFolder(channel) {
        if (!fs.existsSync(this.logs + channel.substr(1))){
          fs.mkdirSync(this.logs + channel.substr(1));
          console.log('[LOG] created folder: ' + channel);
        }
    }

    userLogs(channel, username, message)
    {
        if (!fs.existsSync(this.logs + channel.substr(1) +'/' + this.date.getFullYear())) {
            fs.mkdirSync(this.logs + channel.substr(1) +'/' + this.date.getFullYear());
        }
        if (!fs.existsSync(this.logs + channel.substr(1) +'/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()])) {
            fs.mkdirSync(this.logs + channel.substr(1) +'/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()]);
        }
        var file = this.logs + channel.substr(1) +'/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()] + '/' + username +'.txt';
        fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\r\n', function(){});
    }

    saveMessage(channel, username, message)
    {
        var timestamp =  moment.utc().format("YYYY-MM-DD HH:mm:ss");
        this.bot.mysql.query("INSERT INTO `chatlogs` (channel, timestamp, username, message) VALUES (?, ?, ?, ?)", [channel, timestamp, username, message], function(err, results) {
            if (err) {
                console.log(err);
            }
        });
    }

    uploadLogs(channel, username, args, prefix)
    {
        var logsFor = username;
        if (args.length > 0) {
            logsFor = args[0].toLowerCase();
        }

        var logFile = this.logs + channel.substr(1) +'/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()] + '/' + logsFor +'.txt';
        var logsShort = null;
        if (lib.fileExists(logFile)) {
            fs.readFile(logFile, (err,data) => {
                var logs = data.toString()
                var logsShort = '';
                var lsplit = logs.split('\r\n');
                for (var i = lsplit.length; i > (lsplit.length - 500); i--) {
                    if (lsplit[i] == '' || typeof lsplit[i] === 'undefined') {
                        continue;
                    }
                    logsShort += lsplit[i] + "\r\n";
                }
                if (logsShort == '' || logsShort == null) {
                    console.log("[logs] invalid logs")
                    return false;
                }
                try {
                    cfg.pastebin.createPaste(logsShort, 'short logs for ' + logsFor + ' in ' + channel,null,3, '10M')
                        .then((data) => {
                            console.log('Pastebin created: ' + data);
                            console.log(logsFor, logFile);
                            this.bot.whisper(username, prefix + 'last 500 lines for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data + ' from ' + this.month[this.date.getMonth()]);
                        })
                        .fail(function (err) {
                            console.log(channel, err);
                        });
                } catch (err) {
                    console.log(err);
                }
            });
        }
        else {
            console.log('[LOG] ' + logsFor + ' has no log here');
        }
    }
}
