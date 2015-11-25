var cfg = require('../cfg.js');
var fs = require('graceful-fs');
var twitch = require('./twitch');
var moment = require('moment');
var fn = require('./functions');

var client = twitch.client;

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

client.on('chat', function (channel, user, message, self) {   
    var file = 'logs/' + channel.substr(1) + '/' + user.username +'.txt';
    fs.exists(file, function (exists) {
        if(exists){
            var data = fs.readFileSync(file); //read existing contents into data
            var fd = fs.openSync(file, 'w+');
            var buffer = new Buffer('[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n');
            fs.writeSync(fd, buffer, 0, buffer.length); //write new data
            fs.writeSync(fd, data, 0, data.length); //append old data
            fs.close(fd);
        } else {
            fs.writeFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {
              if (err) throw err;
              console.log('created ' + user.username + '.txt');
            });
        }
    });
});

client.on('action', function (channel, user, message, self) {
    var file = 'logs/' + channel.substr(1) + '/' + user.username +'.txt';
    fs.exists(file, function (exists) {
        if(exists){
            var data = fs.readFileSync(file); //read existing contents into data
            var fd = fs.openSync(file, 'w+');
            var buffer = new Buffer('[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n');
            fs.writeSync(fd, buffer, 0, buffer.length); //write new data
            fs.writeSync(fd, data, 0, data.length); //append old data
            fs.close(fd);
        } else {
            fs.writeFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {
              if (err) throw err;
              console.log('created ' + user.username + '.txt');
            });
        }
    });
});

client.on('chat', function (channel, user, message, self) {   
    var file = 'logs/' + channel.substr(1) +'.txt';
    fs.exists(file, function (exists) {
        if(exists){
            var data = fs.readFileSync(file); //read existing contents into data
            var fd = fs.openSync(file, 'w+');
            var buffer = new Buffer('[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n');
            fs.writeSync(fd, buffer, 0, buffer.length); //write new data
            fs.writeSync(fd, data, 0, data.length); //append old data
            fs.close(fd);
        } else {
            fs.writeFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {
              if (err) throw err;
              console.log('created ' + channel + '.txt');
            });
        }
    });
});

client.on('action', function (channel, user, message, self) {
    var file = 'logs/' + channel.substr(1) +'.txt';
    fs.exists(file, function (exists) {
        if(exists){
            var data = fs.readFileSync(file); //read existing contents into data
            var fd = fs.openSync(file, 'w+');
            var buffer = new Buffer('[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n');
            fs.writeSync(fd, buffer, 0, buffer.length); //write new data
            fs.writeSync(fd, data, 0, data.length); //append old data
            fs.close(fd);
        } else {
            fs.writeFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {
              if (err) throw err;
              console.log('created ' + channel + '.txt');
            });
        }
    });
});


client.on('chat', function (channel, user, message, self) {
    if ( message.substr(0,5) == '!logs' && global.cooldown === false)  {
        if (!(message === '!logs')) {
           global.cooldown = true;
            var logsFor = fn.getNthWord(message,2);
            var logsForLower = logsFor.toLowerCase();
            var logFile = 'logs/' + channel.substr(1) + '/' + logsForLower + '.txt';
            var logFileChannel = 'logs/' + channel.substr(1) + '.txt';
            var logsShort = null;

            if (logsFor === 'channel') {
                fs.readFile(logFileChannel, function(err,data) {
                    var shortLogs = data.toString()
                    shortLogs = shortLogs.substr(0, 300000);
                    cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + channel.substr(1),null,2) 
                            .then(function (data) {
                                client.say(channel, '@' + user.username + ', pastebin.com/' + data);
                                console.log('Pastebin created: ' + data);
                                setTimeout(function(){
                                    cfg.pastebin.deletePaste(data)
                                    console.log('Pastebin deleted: ' + data)
                                }, 600000);    
                            })
                            .fail(function (err) {
                                    client.say(channel, err);
                                    console.log(err);
                    });
                });
            }
            else {
                if (fn.fileExists(logFile)) {
                    if (fn.getFilesizeInKilobytes(logFile) > 500) {
                        fs.readFile(logFile, function(err,data) {
                            var shortLogs = data.toString()
                            shortLogs = shortLogs.substr(0, 300000);
                            cfg.pastebin.createPaste(shortLogs, 'short logs for channel ' + user['username'],null,2) 
                                    .then(function (data) {
                                        client.say(channel, '@' + user.username + ', pastebin.com/' + data);
                                        console.log('Pastebin created: ' + data);
                                        setTimeout(function(){
                                            cfg.pastebin.deletePaste(data)
                                            console.log('Pastebin deleted: ' + data)
                                        }, 600000);    
                                    })
                                    .fail(function (err) {
                                            client.say(channel, err);
                                            console.log(err);
                            });
                        });
                    } 
                    else {
                        cfg.pastebin.createPasteFromFile(logFile, 'logs for ' + logsFor,null,2) 
                            .then(function (data) {
                                client.say(channel, '@' + user.username + ', pastebin.com/' + data);
                                console.log('Pastebin created: ' + data);
                                setTimeout(function(){
                                    cfg.pastebin.deletePaste(data)
                                    console.log('Pastebin deleted: ' + data)
                                }, 600000);    
                            })
                            .fail(function (err) {
                                    client.say(channel, err);
                                    console.log(err);
                            });
                    }
                }
                else {
                    if (fn.stringIsLongerThan(logsFor, 20)) {
                        logsFor = 'the user';
                    }
                    client.say(channel, user['username'] + ', ' + logsFor + ' has no log here');
                }
            }
        }
    }
})
