var cfg = require('./../../cfg');
var fn = require('./../controllers/functions');
var output = require('./../connection/output');
var redis = require('./../models/redis');

function lineCount(channel, username, message, callback)
{
    if (message.toLowerCase() === '!lines') {
        var linesFor = username.toLowerCase();
        redis.hget(channel + ":linecount:user", linesFor, function (err, obj) {
            return callback({
                channel: channel,
                message: linesFor + ' has written a total of ' + obj + ' lines'
            });
        });
    }
    else if (message.toLowerCase() === '!lines channel') {
        redis.hget(channel + ":linecount:channel", 'lines', function (err, obj) {
            return callback({
                channel: channel,
                message: 'Chat has written a total of ' + obj + ' lines'
            });
        });
    }
    else {
        var linesFor = fn.getNthWord(message,2).toLowerCase();
        redis.hget(channel + ":linecount:user", linesFor, function (err, obj) {
            return callback({
                channel: channel,
                message: linesFor + ' has written a total of ' + obj + ' lines'
            });
        });
    }
}

function recordLines(channel, username, message)
{
    redis.hincrby(channel + ':linecount:channel', 'lines', 1);
    redis.hincrby(channel + ':linecount:user', username.toLowerCase(), 1);
}

module.exports =
{
    lineCount,
    recordLines
}
