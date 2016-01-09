// this manager handles general configurations like trusted people, cooldowns and such
var mysql = require('./../DB/mysql');
var fn    = require('./../modules/functions');

mysql.db.query('SELECT * FROM config', function(err, rows) {
    clearInterval(global.cooldownInterval);
    clearInterval(global.whisperCooldownInterval);
    setGlobalCooldown(rows[0].globalcooldown);
    setWhisperCooldown(rows[0].whispercooldown);
});

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
        global.cooldown = false;
    }, cooldown);
}


function admin(channel, username, message, whisper)
{
    if (message.toLowerCase() === '!admin') {
        return false; // make sure a command is given
    }
    var command = fn.getNthWord(message, 2).toLowerCase();
    if (command === 'addtrusted') {
        if (message.toLowerCase() === '!admin addtrusted') {
            return false;
        }
        var newTrusted = fn.getNthWord(message, 3)
        mysql.db.query('INSERT INTO trusted (username) VALUES (?) ', [newTrusted], function (err) {
            if (!err) {
                console.log('[CFG] added ' + newTrusted + ' to trusted');
            }
        })
    }
}

module.exports =
{
    admin
}
