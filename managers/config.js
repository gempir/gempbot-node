// this manager handles general configurations like trusted people, cooldowns and such
var mysql = require('./../DB/mysql');
var fn    = require('./../modules/functions');
var output = require('./../connection/output');

function setCooldowns()
{
    mysql.db.query('SELECT * FROM config', function(err, rows) {
        clearInterval(global.cooldownInterval);
        clearInterval(global.whisperCooldownInterval);
        setGlobalCooldown(rows[0].globalcooldown);
        setWhisperCooldown(rows[0].whispercooldown);
        setPriorityCooldown(rows[0].prioritycooldown);
    });
}

function setGlobalCooldown(cooldown)
{
    console.log('[CFG] globalcooldown: ' + cooldown);
    global.cooldownInterval = setInterval(function() {
        global.cooldown = false;
    }, cooldown);
}

function setWhisperCooldown(cooldown)
{
    console.log('[CFG] whispercooldown: ' + cooldown);
    global.whisperCooldownInterval = setInterval(function() {
        global.whisperCooldown = false;
    }, cooldown);
}

function setPriorityCooldown(cooldown)
{
    console.log('[CFG] priorityCooldown: ' + cooldown);
    global.priorityCooldownInterval = setInterval(function() {
        global.priorityCooldown = false;
    }, cooldown);
}


function admin(channel, username, message, whisper)
{
    if (message.toLowerCase() === '!admin') {
        return false; // make sure a command is given
    }
    var command = fn.getNthWord(message, 2).toLowerCase();
    switch(command) {
        case 'trusted':
            trusted(channel, username, message, whisper);
            break;
        case 'cd':
            cooldown(channel, username, message, whisper);
            break;
    }
}

function trusted(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 3);
    if (typeof command === 'undefined') {
        return false;
    };
    if (command === 'add') {
        var newTrusted = fn.getNthWord(message, 4)
        if (typeof newTrusted === 'undefined') {
            return false;
        };
        mysql.db.query('INSERT INTO trusted (username) VALUES (?) ', [newTrusted], function (err) {
            if (!err) {
                console.log('[CFG] added ' + newTrusted + ' to trusted');
                if (whisper) {
                    output.whisper(username, 'added ' + newTrusted + ' to trusted');
                }
                else {
                    output.sayNoCD(channel, '@' + username + ', added ' + newTrusted + ' to trusted');
                }
                refreshTrusted();
            }
        })
    }
    if (command === 'remove') {
        var deleteTrusted = fn.getNthWord(message, 4)
        if (typeof deleteTrusted === 'undefined') {
            return false;
        };
        mysql.db.query('DELETE FROM trusted WHERE username = ?', [deleteTrusted], function (err) {
            if (!err) {
                console.log('[CFG] removed ' + deleteTrusted + ' from trusted');
                if (whisper) {
                    output.whisper(username, 'removed ' + deleteTrusted + ' from trusted');
                }
                else {
                    output.sayNoCD(channel, '@' + username + ', removed ' + deleteTrusted + ' from trusted');
                }
                refreshTrusted();
            }
        })
    }
}

function cooldown(channel, username, message, whisper)
{
    var command = fn.getNthWord(message, 3).toLowerCase();

    if (typeof command === 'undefined') {
        return false;
    }

    if (command === 'whisper') {
        var cd = fn.getNthWord(message, 4)
        if (typeof cd === 'undefined') {
            return false;
        };
        mysql.db.query('UPDATE config SET whispercooldown = ? WHERE id = 1', [cd], function (err) {
            if (!err) {
                console.log('[CFG] whisper cd: ' + cd);
                if (whisper) {
                    output.whisper(username, ' new whisper cd: ' + cd + ' ms');
                }
                else {
                    output.sayNoCD(channel, '@' + username + ', new whisper cd: ' + cd + ' ms');
                }
                setCooldowns();
            }
        })
    }
    if (command === 'global') {
        var cd = fn.getNthWord(message, 4)
        if (typeof cd === 'undefined') {
            return false;
        };
        mysql.db.query('UPDATE config SET globalcooldown = ? WHERE id = 1', [cd], function (err) {
            if (!err) {
                console.log('[CFG] global cd: ' + cd);
                if (whisper) {
                    output.whisper(username, ' new global cd: ' + cd + ' ms');
                }
                else {
                    output.sayNoCD(channel, '@' + username + ', new global cd: ' + cd + ' ms');
                }
                setCooldowns();
            }
        })
    }
    if (command === 'priority') {
        var cd = fn.getNthWord(message, 4)
        if (typeof cd === 'undefined') {
            return false;
        };
        mysql.db.query('UPDATE config SET prioritycooldown = ? WHERE id = 1', [cd], function (err) {
            if (!err) {
                console.log('[CFG] priority cd: ' + cd);
                if (whisper) {
                    output.whisper(username, ' new priority cd: ' + cd + ' ms');
                }
                else {
                    output.sayNoCD(channel, '@' + username + ', new priority cd: ' + cd + ' ms');
                }
                setCooldowns();
            }
        })
    }
}






function refreshTrusted()
{
    mysql.db.query('SELECT username FROM trusted', function(err, rows) {
        if (err) {
            console.log('[ERROR] failed to fetch trusted');
        }
        global.trusted = [];
        for (i = 0, len = rows.length; i < len; i++) {
            global.trusted.push(rows[i].username);
        }
        console.log('[LOG] trusted: ' + global.trusted);
    });
}


module.exports =
{
    admin,
    refreshTrusted,
    setCooldowns
}
