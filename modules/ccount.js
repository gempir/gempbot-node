var output = require('./../connection/output');
var fn = require('./functions');
var mysql = require('./../DB/mysql');

function countCommandUsage(command)
{
    mysql.db.query('UPDATE totals SET count = count + 1 WHERE command = ?', [command], function(err) {
        if (err) console.log(err);
        return true;
    });
}

function countCommandHandler(channel, username, message, whisper)
{
    if (message === '!ccount') {
        return false;
    }

    var command = fn.getNthWord(message, 2);

    if (command === 'nuked') {
        getCountForNuked(channel, username, message, whisper);
    }
    else {
        getCountForCommand(channel, username, message, whisper);
    }

}

function getCountForNuked(channel, username, message, whisper)
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


function getCountForCommand(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 2);

    mysql.db.query('SELECT count FROM totals WHERE command = ?', [command], function(err, rows) {

        var count = rows[0].count;

        if (whisper) {
            output.whisper(username, command + ' has been used ' + count + ' times');
        }
        else {
            output.say(channel, command + ' has been used ' + count + ' times');
        }
    });
}

module.exports =
{
    countCommandHandler,
    countCommandUsage
}
