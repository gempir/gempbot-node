var cfg    = require('./../../cfg');
var net    = require('net');
var redis  = require('./../models/redis');
var irc    = {};
var events = require('events');
var event  = new events.EventEmitter();
var fn     = require('./../controllers/functions');


irc.socket = new net.Socket();
irc.socket.setEncoding('utf-8');
irc.socket.setNoDelay();
irc.socket.connect(cfg.irc.port, cfg.irc.server);

var channels = {};

function channelCache()
{
    console.log('[cache] caching channels');
    redis.hgetall('channels', function(err, results) {
       if (err) {
           console.log('[REDIS] ' + err);
       } else {
            for (var channel in results) {
              if (results.hasOwnProperty(channel)) {
                channels[channel] = results[channel];
              }
            }
       }
    });
}

irc.socket.on('connect', function () {
    event.emit('connected');
    console.log('[irc] connected to ' + cfg.irc.server + ':' + cfg.irc.port);
    irc.socket.write('PASS ' + cfg.irc.pass + '\r\n');
	irc.socket.write('USER ' + cfg.irc.username + '\r\n');
    irc.socket.write('NICK ' + cfg.irc.username + '\r\n');
    redis.hgetall('channels', function(err, results) {
       if (err) {
           console.log('[REDIS] ' + err);
       } else {
            for (var channel in results) {
              if (results.hasOwnProperty(channel)) {
                irc.socket.write('JOIN ' + channel + '\r\n');
                event.emit('joined', channel);
                channels[channel] = results[channel];
              }
            }
       }
    });
});

irc.socket.on('data', function(data) {
    data = data.replace(/(\r\n|\n|\r)/gm,"");
    if (data.substr(0,1) == ':') {
        return;
    }
    if (data.indexOf('.tmi.twitch.tv WHISPER') > -1) {
        handleWhisper(data);
        return;
    }
    if (data.indexOf('PRIVMSG') === -1) {
        return;
    }
    data = data.substr(1);

    tags = getTags(data);
    channel = getChannel(data);
    message = getMessage(data);

    messageObj = {
        user: {
            turbo: tags['user-id'],
            emotes: tags.emotes,
            subscriber: tags.subscriber,
            'user-type': tags['user-type'],
            username: tags['display-name'].toLowerCase(),
            'display-name': tags['display-name'],
            action: tags.action
        },
        channel: channel,
        message: message
    }
    event.emit('message', messageObj.channel, messageObj.user, messageObj.message)
});


function handleWhisper(data) {
    console.log(data);
}

function getTags(data) {
    var tags = {};
    tags['action'] = false;

    if (data.indexOf('ACTION ') > -1) {
        tags['action'] = true;
    }
    var tagsRaw = data.split(';');
    for (var i = 0; i < tagsRaw.length; i++) {
        var tag = tagsRaw[i].split('=');
        tags[tag[0]] = tag[1];
        tag[1] = tag[1] || '';
        if (tag[1].substr(0,1) == ' ') {
            tags[tag[0]] = '';
        }
        if (tag[0] == 'emotes' && tag[1] != '') {
            var emotes = {};
            var emotesRaw = tag[1].split('/');
            for (var j = 0; j < emotesRaw.length; j++) {
                var emote = emotesRaw[j].split(':');
                var id    = emote[0];
                var pos   = emote[1];
                var pos = pos.split(',');
                emotes[id] = pos;
            }
            tags[tag[0]] = emotes;
        }

    }
    return tags;
}

function getChannel(data) {
    var msg = data.split('PRIVMSG ');
    msg = msg[1].split(' :');
    return msg[0];
}

function getMessage(data) {
    var msgRaw = data.split('PRIVMSG #')
    msgRaw = msgRaw[1].split(' :');
    var message = msgRaw[1];
    if (message.indexOf('ACTION ') > -1) {
        message = message.substr(8);
        message = message.substring(0, message.length - 3)
    }
    return message;
}

var commandCooldowns = {};
var userCooldowns = [];

function say(channel, message, action) {
    if (channels[channel] == 0) {
        return false;
    }

    action = action || false;
    var prefix = '';

    if (action) {
        prefix = '/me ';
    }
    irc.socket.write('PRIVMSG ' + channel + ' :' + prefix + message +'\r\n');
    console.log(channel + ' ' + prefix + message);
}


function sayCommand(channel, username, response, commObj)
{
    if (channels[channel] == 0) {
        return false;
    }

    if (userCooldowns.indexOf(username.toLowerCase()) > -1) {
        return false;
    }

    if (typeof commandCooldowns[channel] === 'undefined') {
        commandCooldowns[channel] = [];
    }

    if (commandCooldowns[channel].indexOf(commObj.command) > -1) {
        console.log('[COMMAND] ' + commObj['command'] + ' cooldown');
        return false;
    }
    if (commObj.response) {
        response.message = '@' + username + ', ' + response.message;
    }

	say(channel, response.message);
	console.log('[COMMAND] ' + response.message);

    commandCooldowns[channel].push(commObj.command);
    setTimeout(function(){
        fn.removeFromArray(commandCooldowns[channel], commObj.command);
    }, commObj['cooldown'] * 1000);

    userCooldowns.push(username.toLowerCase());
    setTimeout(function(){
        fn.removeFromArray(userCooldowns, username.toLowerCase());
    }, 2000);
}

module.exports = {
    irc,
    event,
    say,
    sayCommand,
    commandCooldowns,
    userCooldowns,
    channels,
    channelCache
}
