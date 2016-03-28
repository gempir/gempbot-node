
import cfg    from './../../cfg.js';
import fs     from 'fs';
import moment from 'moment';
import fn     from './../controllers/functions';

export default class Logs
{
    constructor(bot)
    {
        this.bot  = bot;
        this.logs = __dirname +'/../../../logs/';

        if (!fs.existsSync(this.logs)){
            fs.mkdirSync(this.logs);
            console.log('[LOG] created folder: logs');
        }
    }

    createFolder(channel) {
        if (!fs.existsSync(this.logs + channel.substr(1))){
          fs.mkdirSync(this.logs + channel.substr(1));
          console.log('[LOG] created folder: ' + channel.substr(1));
        }
    }

    userLogs(channel, username, message)
    {
        var file = this.logs + channel.substr(1) + '/' + username +'.txt';
        fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\r\n', function(){});
    }

    uploadLogs(channel, username, args, prefix)
    {
        var logsFor = username;
        if (args.length > 0) {
            logsFor = args[0];
        }

        var logFile = this.logs + channel.substr(1) + '/' + logsFor + '.txt';
        var logFileChannel = this.logs + channel.substr(1) + '.txt';
        var logsShort = null;
        if (fn.fileExists(logFile)) {
            fs.readFile(logFile, (err,data) => {
                var logs = data.toString()
                // TODO: split by lines
                var shortLogs = logs.substr(logs.length - 20000);

                cfg.pastebin.createPaste(shortLogs, 'short logs for ' + logsFor + ' in ' + channel,null,3, '10M')
                        .then((data) => {
                            console.log('Pastebin created: ' + data);
                            console.log(logsFor, logFile);
                            this.bot.whisper(username, prefix + 'last 20k chars for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data);
                        })
                        .fail(function (err) {
                            console.log(channel, err);
                        });
            });
        }
        else {
            console.log('[LOG] ' + logsFor + ' has no log here');
        }
    }
}
