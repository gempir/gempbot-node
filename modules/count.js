var output = require('./../connection/output');
var fs = require('graceful-fs');
var fn = require('./functions');
var mysql = require('./../DB/mysql');


function countMe(channel, username, message, whisper)
{
    var searchPhrase = message.replace('!countme','');
    fs.readFile('logs/' + channel.substr(1) + '/' + username +'.txt', function (err, data) {
        var emoteCount = occurrences(data, searchPhrase);
        emoteCount = fn.numberFormatted(emoteCount);

        if (fn.stringContainsUrl(searchPhrase) || fn.stringIsLongerThan(searchPhrase, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = searchPhrase;
        }
        if (whisper) {
            output.whisper(username, 'You used ' + phrase + ' ' + emoteCount + ' times');
        }
        else {
            output.say(channel, '@' + username + ', you used ' + phrase + ' ' + emoteCount + ' times');
        }
    });
}


function countCommandHandler(channel, username, message, whisper)
{
    if (message === '!count') {
        return false;
    }

    var command = fn.getNthWord(message, 2);

    switch (command) {
        case 'nuked':
            getCountForCommand(channel, username, message, whisper);
            break;
    }

}

function getCountForCommand(channel, username, message, whisper)
{
    mysql.db.query('SELECT count FROM totals WHERE command = ?', ['nuked'], function(err, rows) {

        var count = rows[0].count;

        if (whisper) {
            output.whisper(username, count + ' chatters have been nuked in total');
        }
        else {
            output.say(channel, count + ' chatters have been nuked in total');
        }
    });
}



function occurrences(haystack, needle)
{
    var count = 0;
    var position = 0;
    while(true) {
        position = haystack.indexOf(needle, position);
        if( position != -1) {
            count++;
            position += needle.length;
        }
    else{
      break;
    }
  }
  return count;
}

module.exports =
{
    countMe,
    countCommandHandler
}
