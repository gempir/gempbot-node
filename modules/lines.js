var cfg = require('../cfg');
var fn = require('./functions');
var fs = require('graceful-fs');
var output = require('./twitch/output');


function countLines(channel, user, message, whisper)
{
    if (message.toLowerCase() === '!lines') {
        return false;
    }
    var linesFor = fn.getNthWord(message,2).toLowerCase();
    if (linesFor === 'channel') {
        var fileChannel = 'logs/' + channel.substr(1) + '.txt';
        var lineCount = fn.lineCount(file);
        lineCount = fn.numberFormatted(lineCount);
        if (whisper) {
            output.whisper(user,'Channel ' + channel.substr(1) + ' has ' + lineCount + ' lines');
        }
        else {
            output.say(channel, '@' + user['username'] + ', channel ' + channel.substr(1) + ' has ' + lineCount + ' lines');
        }
    }
    else {
        var file = 'logs/' + channel.substr(1) + '/' + linesFor +'.txt';
        var lineCount = fn.lineCount(file);
        lineCount = fn.numberFormatted(lineCount);
        if (whisper) {
            output.whisper(user, linesFor + ' spammed ' + lineCount + ' lines');
        }
        else {
            output.say(channel, '@' + user['username'] + ', ' + linesFor + ' spammed ' + lineCount + ' lines');
        }
    }   
}


module.exports = 
{
    countLines
}    

