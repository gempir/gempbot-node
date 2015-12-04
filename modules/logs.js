var cfg    = require('../cfg.js');
var fs     = require('graceful-fs');
var moment = require('moment');
var fn     = require('./functions');
var output = require('./twitch/output');

if (!fs.existsSync('logs')){
    fs.mkdirSync('logs');
    console.log('Created folder: logs');
}

cfg.options.channels.forEach(function(channel) {
  if (!fs.existsSync('logs/' + channel.substr(1))){
    fs.mkdirSync('logs/' + channel.substr(1));
    console.log('Created folder: ' + channel.substr(1));
  }
});


function userLogs(channel, user, message)
{
    var file = 'logs/' + channel.substr(1) + '/' + user.username +'.txt';
    fs.exists(file, function (exists) {
        if(exists){
            var data = fs.readFileSync(file); 
            var fd = fs.openSync(file, 'w+');
            var buffer = new Buffer('[GMT+1 ' + moment().utcOffset(60).format('DD.MM.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n');
            fs.writeSync(fd, buffer, 0, buffer.length); 
            fs.writeSync(fd, data, 0, data.length); 
            fs.close(fd);
        } else {
            fs.writeFile(file, '[GMT+1 ' + moment().utcOffset(60).format('DD.MM.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {
              if (err) throw err;
              console.log('created ' + user.username + '.txt');
            });
        }
    });
}


function channelLogs(channel, user, message) 
{
    var file = 'logs/' + channel.substr(1) +'.txt';
    fs.appendFile(file, user.username + ': ' + message + '\n', function(){});
}


function uploadLogs(channel, user, message) 
{
    if (message.toLowerCase() === '!logs') {
        return false;
    }

    var logsFor = (fn.getNthWord(message, 2)).toLowerCase();
    var logFile = 'logs/' + channel.substr(1) + '/' + logsFor + '.txt';
    var logFileChannel = 'logs/' + channel.substr(1) + '.txt';
    var logsShort = null;
    
    console.log(logsFor);
    if (logsFor === 'channel') {
        fs.readFile(logFileChannel, function(err,data) {
            var shortLogs = data.toString()
            shortLogs = shortLogs.substr(shortLogs.length - 300000);
            cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + channel.substr(1),null,0, '10M') 
                    .then(function (data) {
                        console.log('Pastebin created: ' + data);
                        console.log(logsFor, logFileChannel);
                        output.whisper(user.username, 'short logs for channel '+ channel.substr(1) + ' pastebin.com/' + data); 
                    })
                    .fail(function (err) {
                            output.say(channel, err);
                            console.log(err);
            });
        });
    }
    else {
        if (fn.fileExists(logFile)) {
                fs.readFile(logFile, function(err,data) {
                    var shortLogs = data.toString()
                    shortLogs = shortLogs.substr(0, 300000);
                    cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + user['username'],null,0, '10M') 
                            .then(function (data) {
                                console.log('Pastebin created: ' + data);
                                console.log(logsFor, logFile);
                                output.whisper(user.username, 'short logs for '+ logsFor + ' pastebin.com/' + data);
                            })
                            .fail(function (err) {
                                    output.say(channel, err);
                                    console.log(err);
                    });
                });
            } 
        else {
            if (fn.stringContainsUrl(logsFor) || fn.stringIsLongerThan(logsFor, 20)) {
                var userLogs = 'the user';
            }
            else {
                var userLogs = logsFor;
            }
            output.say(channel, user['username'] + ', ' + userLogs + ' has no log here');
        }
    }
}

module.exports = 
{
    channelLogs,
    userLogs,
    uploadLogs
}