import fs     from 'fs';
import moment from 'moment';
import fn     from './../controllers/functions';
import cfg    from './../../cfg';



export default class Oddshots {
    constructor(bot)
    {
        this.bot  = bot;
        this.logs = __dirname +'/../../../logs/';
    }

    saveChannelOddshots(channel, username, message)
    {
        var file = this.logs + channel.substr(1) + '/oddshots.txt';
        var oddshotChannel = channel.substr(1);

        if (channel.indexOf('_') > -1) {
            var channelSplit = channel.substr(1).split('_');
            oddshotChannel = channelSplit[0] + '-' + channelSplit[1];
        }

        if (!fn.fileExists(file)) {
           fs.appendFile(file, '\r\n', function(){});
       }

        if (message.indexOf('oddshot.tv/shot/' + oddshotChannel) > -1) {
            this.parseOddshots(channel, username, message);
        }
    }

    parseOddshots(channel, username, message)
    {
        message = ' ' + message;
        console.log("parsing Oddshots: ", channel, username, message);
        var file = this.logs + channel.substr(1) + '/oddshots.txt';
        var messageSplit = message.split(' ');

        fs.readFile(file, function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            (function(data) {
                for (var i = 0; i < (messageSplit.length -1); i++) {
                    if (messageSplit[i].indexOf('oddshot.tv/shot/') < 0) {
                        continue;
                    }
                    if (data.indexOf(messageSplit[i]) < 0) {
                        fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\r\n', function(){})
                        return true;
                    }
                }
            })(data);
        });
    }

    getOddshots(channel, username)
    {
        var logFile = this.logs + channel.substr(1) + '/' + 'oddshots.txt';
        console.log(logFile);
        if (fn.fileExists(logFile)) {
            fs.readFile(logFile, (err,data) => {
                var logs = data.toString()
                var logsShort = '';
                var lsplit = logs.split('\r\n');
                for (var i = lsplit.length; i > (lsplit.length - 1000); i--) {
                    if (lsplit[i] == '' || typeof lsplit[i] === 'undefined') {
                        continue;
                    }
                    logsShort += lsplit[i] + "\r\n";
                }

                cfg.pastebin.createPaste(logsShort, 'oddshots in ' + channel,null,3, '10M')
                        .then((data) => {
                            console.log('Pastebin created: ' + data);
                            this.bot.whisper(username, 'oddshots in ' + channel + ' pastebin.com/' + data);
                        })
                        .fail(function (err) {
                            console.log(channel, err);
                        });
            });
        }
        else {
            console.log('[logs] no oddshot file');
        }
    }
}
