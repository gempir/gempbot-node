var output = require('./../connection/output');
var fn = require('./functions');
var mysql = require('./../DB/mysql');

function ccountCommandUsage(command)
{
    mysql.db.query('UPDATE totals SET count = count + 1 WHERE command = ?', [command], function(err) {
        if (err) console.log(err);
        return true;
    });
}

function ccountCommandHandler(channel, username, message)
{
    if (message === '!ccount') {
        return false;
    }

    var command = fn.getNthWord(message, 2);

    if (global.loggedCommands.indexOf(command) === -1) {
        return false;
    }

    if (command === 'nuked') {
        getCountForNuked(channel, username, message);
    }
    else {
        getCountForCommand(channel, username, message);
    }

}

function getCountForNuked(channel, username, message)
{
    mysql.db.query('SELECT count FROM totals WHERE command = ?', ['nuked'], function(err, rows) {

        var count = rows[0].count;
        output.say(channel, count + ' chatters have been nuked in total');
        
    });
}


function getCountForCommand(channel, username, message)
{
    var command = fn.getNthWord(message, 2);

    mysql.db.query('SELECT count FROM totals WHERE command = ?', [command], function(err, rows) {

        var count = rows[0].count;
        output.say(channel, command + ' has been used ' + count + ' times');
        
    });
}

module.exports =
{
    ccountCommandHandler,
    ccountCommandUsage
}
