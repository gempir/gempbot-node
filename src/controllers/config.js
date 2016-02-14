var fn    = require('./functions');
var output = require('./../connection/output');
var redis  = require('./../models/redis');

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
    getActiveCommands
};
