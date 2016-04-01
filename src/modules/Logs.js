
import cfg    from './../../cfg.js';
import fs     from 'fs';
import moment from 'moment';
import fn     from './../controllers/functions';

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

    uploadLogs(channel, username, args, prefix)
    {
        var logsFor = username;
        if (args.length > 0) {
            logsFor = args[0].toLowerCase();
        }

        var logFile = this.logs + channel.substr(1) +'/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()] + '/' + logsFor +'.txt';
        var logsShort = null;
        if (fn.fileExists(logFile)) {
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
                            this.bot.whisper(username, prefix + 'last 1k lines for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data + ' from ' + this.month[this.date.getMonth()]);
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
