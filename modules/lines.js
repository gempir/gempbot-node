var cfg = require('../cfg');
var fn = require('./functions');
var fs = require('graceful-fs');
var output = require('./../connection/output');
var redis = require('./../controllers/redis');


function lineCount(file, username)
{
    var fileBuffer =  fs.readFileSync(file);
    var to_string = fileBuffer.toString();
    var split_lines = to_string.split("\n");
    split_lines.pop();
    var lineCount = split_lines.length;
    return lineCount;
}

function stats(channel, username, message)
{
    if (message === '!lines') { // make sure a username is actually specified
        var linesFor = username;
    }
    else {
        var linesFor = fn.getNthWord(message,2).toLowerCase();
    }
    var file = 'logs/' + channel.substr(1) + '/' + linesFor +'.txt';
    if (!fn.fileExists(file)) {
        return false;
    }
    var lines = lineCount(file, linesFor);

    output.say(channel, '@' + username + ', ' + linesFor + ' has written ' + lines + ' lines');
}

function recordLines(channel, username, message)
{
    redis.hincrby(channel + ':linecount:channel', 'lines', 1);
    redis.hincrby(channel + ':linecount:user', username, 1);
}

module.exports =
{
    stats,
    recordLines
}
