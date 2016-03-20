var fn    = require('./functions');
var redis  = require('./../models/redis');
var logs  = require('./../modules/logs');
var config = {};
var channels = [];

function getTrusted(channel, callback) {
    redis.hgetall(channel + ':trusted', function (err, obj) {
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        var trusted = [];
        for (var username in obj) {
            trusted.push(username.toLowerCase());
        }
        return callback(trusted);
    });
}

function setTrusted(channel, username) {
    redis.hset(channel + ':trusted', username, '1');
}

function removeTrusted(channel, username) {
    redis.del(channel + ':trusted', username);
}

function cacheConfig() {
    console.log('[redis] caching configs');
    redis.hgetall('channels', function(err, results) {
       if (err) {
           console.log('[REDIS] ' + err);
       } else {
            for (var channel in results) {
                channels.push(channel);
                logs.createFolder(channel);
                setConfigForChannel(channel);
            }
       }
    });
}

function setConfigForChannel(channel) {
    redis.hgetall(channel + ':config', function(err, results) {
        config[channel] = results;
    });
}


function setConfig(channel, option, value, callback) {
    redis.hset(channel + ":config", option, value, function() {
        console.log('[redis] updated config');
        return callback('updated ' + option + ' to ' + value);
    });
}

function getActiveCommands(channel, callback) {
    redis.hgetall(channel + ':commands', function(err, obj){
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        var activeCommands = [];
        for (key in obj) {
            var commandObj = JSON.parse(obj[key]);
            if (commandObj.enabled === true) {
                activeCommands.push(commandObj.command)
            }
        }
        return callback(activeCommands);
    });
}

function setCommand(channel, commandObj) {
    var commandString = JSON.stringify(commandObj);
    redis.hset(channel + ':commands', commandObj.command, commandString);
}

function removeCommand(channel, command) {
    redis.hdel(channel + ':commands', command);
}

function getCommand(channel, command, callback) {
    redis.hget(channel + ':commands', command, function (err, obj) {
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        return callback(JSON.parse(obj));
    });
}



module.exports = {
    getTrusted,
    setTrusted,
    removeTrusted,
    setCommand,
    getCommand,
    removeCommand,
    getActiveCommands,
    setConfig,
    cacheConfig,
    config,
    channels
};
