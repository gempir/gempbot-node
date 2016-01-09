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
                output.whisper(username, command + ' is now enabled');
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
                output.whisper(username, command + ' is now disabled');
            }
            else {
                output.sayNoCD(channel, '@' + username + ', ' + command + ' is now disabled');
            }
            refreshActiveCommands();
        }
    })
}

function getMessageCommand(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 1);
    if (typeof command === 'undefined') {
        return false;
    }
    mysql.db.query('SELECT message FROM commands WHERE name = ?', [command], function(err,rows){
        var response = rows[0].message;

        if (whisper) {
            output.whisper(username, response);
        }
        else {
            output.say(channel, '@' + username + ', ' + response);
        }
    });
}

function addMessageCommand(channel, username, message, whisper)
{
    var name = fn.getNthWord(message, 3);
    var commandMessage = message.replace('!command add ' + name , '');

    if (typeof name === 'undefined' || typeof commandMessage === 'undefined') {
        return false;
    }

    mysql.db.query('INSERT INTO commands (name, enabled, message) VALUES (?, 1, ?)', [name,commandMessage], function(err){
        if (err) {
            console.log('[ERROR] adding command failed');
            return false;
        }
        refreshActiveCommands();
        if (whisper) {
            output.whisper(username, 'added command ' + name);
        }
        else {
            output.sayNoCD(channel, '@' + username + ', added command ' + name);
        }
    });
}

function removeMessageCommand(channel, username, message, whisper)
{
    var name = fn.getNthWord(message, 3);

    if (typeof name === 'undefined') {
        return false;
    }

    mysql.db.query('DELETE FROM commands WHERE name = ?', [name], function(err){
        if (err) {
            console.log('[ERROR] removing command failed');
            return false;
        }
        refreshActiveCommands();
        if (whisper) {
            output.whisper(username, 'removed command ' + name);
        }
        else {
            output.sayNoCD(channel, '@' + username + ', removed command ' + name);
        }
    });
}

module.exports =
{
    refreshActiveCommands,
    admin,
    getMessageCommand,
    addMessageCommand,
    removeMessageCommand
}
