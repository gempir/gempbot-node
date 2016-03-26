var cfg    = require('./../../cfg');
var net    = require('net');
var redis  = require('./../models/redis');
var irc    = {};
var events = require('events');
var event  = new events.EventEmitter();
var fn     = require('./functions');
var fs     = require('fs');
var parse = require('irc-message').parse


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
                console.log('JOIN ' + channel);
                event.emit('joined', channel);
                channels[channel] = results[channel];
              }
            }
       }
    });
});

irc.socket.on('data', function(data) {
    data = data.replace(/(\r\n|\n|\r)/gm,"");
    if (data.substr(0,1) != "@" || !(data.indexOf(" PRIVMSG ") > -1)) {
        return; // no tags
    }
    var message = '';
    var emotes = {};
    var action  = false;
    var parsed  = parse(data);
    parsed.params[1] = parsed.params[1] || '';
    message = parsed.params[1];


    if (message.substring(1,8) == "ACTION ") {
        message = message.substr(8)
        message = message.substr(0, message.length-1)
        action  = true;
    }

    if (parsed.tags.emotes != true && typeof parsed.tags.emotes != 'undefined') {
        var emotesRaw = parsed.tags.emotes.split('/');
        for (var j = 0; j < emotesRaw.length; j++) {
            var emote = emotesRaw[j].split(':');
            var id    = emote[0];
            var pos   = emote[1];
            var pos = pos.split(',');
            emotes[id] = pos;
        }
    }

    var messageObj = {
        user: {
            turbo: parsed.tags.turbo,
            emotes: emotes,
            subscriber: parsed.tags.subscriber,
            'user-type': parsed.tags['user-type'],
            username: parsed.tags['display-name'],
            'display-name': parsed.tags['display-name'],
            action: action
        },
        channel: parsed.params[0],
        message: message
    }

    event.emit('message', messageObj.channel, messageObj.user, messageObj.message)
});


function handleWhisper(data) {
    console.log(data);
}


var commandCooldowns = {};
var userCooldowns = [];

function whisper(username, message)
{
    say('#jtv', '/w ' + username + ' ' + message);
}


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

function updateChannelJoins() {
    redis.hgetall('channels', function(err, results) {
        if (err) {
            console.log(err);
            return false;
        }
        for (channel in results) {
            console.log(channel + ' ' + results.channel);
            if (results.channel == 1) {
                irc.socket.write('JOIN ' + channel + '\r\n');
            }
            if (results.channel == 0) {
                irc.socket.write('PART ' + channel + '\r\n');
            }
        }
    });
}

function joinChannel(channel, silent) {
    var response = 1;
    if (silent) {
        response = 0;
    }
    createFolder(channel);
    irc.socket.write('JOIN ' + channel + '\r\n');
    console.log('[redis] ' + channel + ' ' + response);
    redis.hset('channels', channel, response, function(err) {
        if (err) console.log(err);
        channelCache();
    });
}

function createFolder(channel) {
    if (!fs.existsSync('logs/' + channel.substr(1))){
      fs.mkdirSync('logs/' + channel.substr(1));
      console.log('[LOG] created folder: ' + channel.substr(1));
    }
}

function partChannel(channel) {
    irc.socket.write('PART ' + channel + '\r\n');
    console.log('[redis] PART ' + channel)
    redis.hdel('channels', channel, function(err) {
        if (err) console.log(err);
        channelCache();
    });
}

module.exports = {
    irc,
    event,
    say,
    sayCommand,
    commandCooldowns,
    userCooldowns,
    channels,
    channelCache,
    whisper,
    updateChannelJoins,
    joinChannel,
    partChannel
}
