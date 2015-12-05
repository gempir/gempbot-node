var cfg = require('../cfg');
var fn = require('./functions');
var fs = require('graceful-fs');
var output = require('./twitch/output');


function stats(channel, username, message, whisper)
{
    if (message === '!lines') { // make sure a username is actually specified
        return false;
    }
    var linesFor = fn.getNthWord(message,2).toLowerCase();
    var file = 'logs/' + channel.substr(1) + '/' + linesFor +'.txt';
    if (!fn.fileExists(file)) {
        return false;
    }
    var logStats = fn.logStats(file, linesFor);
    
    if (whisper) {
        output.whisper(username, linesFor + '\'s ' + logStats );
    }
    else {
        output.say(channel, '@' + username + ', ' + linesFor + '\'s ' + logStats);
    }   
}


module.exports = 
{
    stats
}    

