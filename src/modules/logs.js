var cfg    = require('./../../cfg.js');
var fs     = require('fs');
var moment = require('moment');
var fn     = require('./../controllers/functions');
var output = require('./../connection/output');

if (!fs.existsSync('logs')){
    fs.mkdirSync('logs');
    console.log('[LOG] Created folder: logs');
}

cfg.options.channels.forEach(function(channel) {
  if (!fs.existsSync('logs/' + channel.substr(1))){
    fs.mkdirSync('logs/' + channel.substr(1));
    console.log('[LOG] Created folder: ' + channel.substr(1));
  }
});

function logsCommandHandler(channel, user, message, callback)
{
    bigCommand = fn.getNthWord(message, 1) + ' ' + fn.getNthWord(message, 2);
    if (bigCommand === '!logs size') {
        logsSize(channel, user, message, function(response) {
            return callback(response);
        });
    }
    else if (fn.getNthWord(message, 1) === '!logs') {
        uploadLogs(channel, user, message);
    }
}

function userLogs(channel, username, message)
{
    var file = 'logs/' + channel.substr(1) + '/' + username +'.txt';
    fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\n', function(){});
}

function uploadLogs(channel, username, message)
{
    if (message.toLowerCase() === '!logs') {
        return false;
    }

    var logsFor = (fn.getNthWord(message, 2)).toLowerCase();
    var logFile = 'logs/' + channel.substr(1) + '/' + logsFor + '.txt';
    var logFileChannel = 'logs/' + channel.substr(1) + '.txt';
    var logsShort = null;
    if (fn.fileExists(logFile)) {
            fs.readFile(logFile, function(err,data) {
                var shortLogs = data.toString()
                shortLogs = shortLogs.substr(shortLogs.length - 20000);

                cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + logsFor,null,3, '10M')
                        .then(function (data) {
                            console.log('Pastebin created: ' + data);
                            console.log(logsFor, logFile);
                            output.whisper(username, 'Last 20k chars for '+ logsFor + ' in ' + channel + ' pastebin.com/' + data);
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

function logsSize(channel, username, message, callback)
{
    var messageStart = message.substr(0,12).toLowerCase();
    var name = fn.getNthWord(message, 3);

    name = name.toLowerCase();
    if (!fn.fileExists('logs/' + channel.substr(1) + '/' + name +  '.txt')) {

        if (fn.stringIsLongerThan(name, 20)) {
            name = 'the user';
        }
        console.log('[LOG] ' + name + ' has no log here');
        return false;
    }
    else {
        var file = 'logs/' + channel.substr(1) + '/' + name +  '.txt'
        var fileSize = fn.getFilesizeInKilobytes(file).toFixed(0);
        var extension = ' KB';
        if (fileSize > 1000) {
            fileSize = fn.getFilesizeInMegabytes(file).toFixed(2);
            extension = ' MB';
        }
        return callback({
            channel: channel,
            message: 'log file for ' + name + ' is ' + fileSize + extension
        });
    }
}

module.exports =
{
    userLogs,
    logsCommandHandler
}
