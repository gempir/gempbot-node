var mysql = require('./../DB/mysql');
var fn    = require('./../modules/functions');
var output = require('./../connection/output');

function refreshActiveCommands()
{
    mysql.db.query('SELECT name FROM commands WHERE enabled = 1', function(err,rows) {
        global.activeCommands = [];
        for (i = 0, len = rows.length; i < len; i++) {
            global.activeCommands.push(rows[i].name);
        }
        console.log(global.activeCommands);
    });

}

function admin(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 2);
    if (typeof command === 'undefined') {
        return false;
    }

    switch(command) {
        case 'enable':
            enableCommand(channel, username, message, whisper);
            break;
        case 'disable':
            disableCommand(channel, username, message, whisper);
            break;
    }
}

function enableCommand(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 3)
    if (typeof command === 'undefined') {
        return false;
    };
    mysql.db.query('UPDATE commands SET enabled = 1 WHERE name = ?', [command], function (err) {
        if (!err) {
            console.log('[CFG] enabled: ' + command);
            if (whisper) {
                output.whisper(username, cd + ' is now enabled');
            }
            else {
                output.sayNoCD(channel, '@' + username + ', ' + command + ' is now enabled');
            }
            refreshActiveCommands();
        }
    })
}

function disableCommand(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 3)
    if (typeof command === 'undefined') {
        return false;
    };
    mysql.db.query('UPDATE commands SET enabled = 0 WHERE name = ?', [command], function (err) {
        if (!err) {
            console.log('[CFG] disabled: ' + command);
            if (whisper) {
                output.whisper(username, cd + ' is now disabled');
            }
            else {
                output.sayNoCD(channel, '@' + username + ', ' + command + ' is now disabled');
            }
            refreshActiveCommands();
        }
    })
}


module.exports =
{
    refreshActiveCommands,
    admin
}
