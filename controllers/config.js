var fn    = require('./../modules/functions');
var output = require('./../connection/output');
var redis  = require('./redis');

function getTrusted(channel, callback) {
    redis.hgetall(channel + ':trusted', function (err, obj) {
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        var trusted = [];
        for (var username in obj) {
            trusted.push(username);
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

function getCommand(channel, command, callback) {
    redis.hget(channel + ':commands', command, function (err, obj) {
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        return callback(obj);
    });
}


// globalcooldown
function setGlobalCooldown(channel) {
    redis.hget(channel + ':config', 'globalcooldown', function(err, obj){
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        global.globalcooldownInterval = setInterval(function() {
            global.globalcooldown = false;
        }, obj);
    });
}

function resetGlobalCooldown(channel, cooldown) {
    redis.hset(channel + ':config', 'globalcooldown', cooldown);
    clearInterval(global.globalcooldownInterval);
    global.globalcooldownInterval = setInterval(function() {
        global.globalcooldown = false;
    }, cooldown);
}

// whispercooldown
function setWhisperCooldown(channel) {
    redis.hget(channel + ':config', 'whispercooldown', function(err, obj){
        if (err) {
            console.log('[redis] ' + err);
            return [];
        }
        global.whispercooldownInterval = setInterval(function() {
            global.whispercooldown = false;
        }, obj);
    });
}

function resetWhisperCooldown(channel, cooldown) {
    redis.hset(channel + ':config', 'whispercooldown', cooldown);
    clearInterval(global.whispercooldownInterval);
    global.whispercooldownInterval = setInterval(function() {
        global.whispercooldown = false;
    }, cooldown);
}


module.exports = {
    getTrusted,
    setTrusted,
    removeTrusted,
    setCommand,
    getCommand,
    getActiveCommands,
    setGlobalCooldown,
    resetGlobalCooldown,
    setWhisperCooldown,
    resetWhisperCooldown
};
