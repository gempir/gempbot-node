var cfg    = require('../cfg.js');
var fs     = require('graceful-fs');
var moment = require('moment');
var fn     = require('./functions');
var output = require('./twitch/output');

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

function logsCommandHandler(channel, user, message, whisper)
{
    bigCommand = fn.getNthWord(message, 1) + ' ' + fn.getNthWord(message, 2);
    if (bigCommand === '!logs size') {
        logsSize(channel, user, message, whisper);
    }
    else if (fn.getNthWord(message, 1) === '!logs') {
        uploadLogs(channel, user, message); // logs are always whispered!
    }
}

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
              console.log('[LOG] created ' + user.username + '.txt');
            });
        }
    });
}


function channelLogs(channel, user, message) 
{
    var file = 'logs/' + channel.substr(1) +'.txt';
    fs.appendFile(file, user.username + ': ' + message + '\n', function(){});
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

    if (logsFor === 'channel') {
        fs.readFile(logFileChannel, function(err,data) {
            var shortLogs = data.toString()
            shortLogs = shortLogs.substr(shortLogs.length - 300000);
            cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + channel.substr(1),null,0, '10M') 
                    .then(function (data) {
                        console.log('Pastebin created: ' + data);
                        console.log(logsFor, logFileChannel);
                        output.whisper(username, 'short logs for channel '+ channel.substr(1) + ' pastebin.com/' + data); 
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
                    cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + username,null,0, '10M') 
                            .then(function (data) {
                                console.log('Pastebin created: ' + data);
                                console.log(logsFor, logFile);
                                output.whisper(username, 'short logs for '+ logsFor + ' pastebin.com/' + data);
                            })
                            .fail(function (err) {
                                    output.say(channel, err);
                                    console.log(err);
                    });
                });
            } 
        else {
            console.log('[LOG] ' + logsFor + ' has no log here');
        }
    }
}

function logsSize(channel, username, message, whisper) 
{
    var messageStart = message.substr(0,12).toLowerCase();
    var name = fn.getNthWord(message, 3);
    
    name = name.toLowerCase();
    if (!fn.fileExists('logs/' + channel.substr(1) + '/' + name +  '.txt') && name != 'channel') {
        
        if (fn.stringIsLongerThan(name, 20)) {
            name = 'the user';
        }
        console.log('[LOG] ' + name + ' has no log here');        
    }
    else {
        if (name === 'channel') {
            var file = 'logs/' + channel.substr(1) + '.txt'
            var fileSize = fn.getFilesizeInKilobytes(file).toFixed(0);
            var extension = ' KB';
            if (fileSize > 1000) {
                fileSize = fn.getFilesizeInMegabytes(file).toFixed(2);
                extension = ' MB';
            }
            if (whisper) {
                output.whisper(username, 'Log file for channel ' + channel.substr(1) + ' is ' + fileSize + extension);
            }
            else {
                output.say(channel, '@' + username + ', ' + 'log file for channel ' + channel.substr(1) + ' is ' + fileSize + extension);
            }
        }
        else {
            var file = 'logs/' + channel.substr(1) + '/' + name +  '.txt'
            var fileSize = fn.getFilesizeInKilobytes(file).toFixed(0);
            var extension = ' KB';
            if (fileSize > 1000) {
                fileSize = fn.getFilesizeInMegabytes(file).toFixed(2);
                extension = ' MB';
            }
            if (whisper) {
                output.whisper(username, 'Log file for ' + name + ' is ' + fileSize + extension);
            }
            else {
                output.say(channel, '@' + username + ', ' + 'log file for ' + name + ' is ' + fileSize + extension);
            }
        }
    }
}

module.exports = 
{
    channelLogs,
    userLogs,
    logsCommandHandler
}