// this manager handles general configurations like trusted people, cooldowns and such
var mysql = require('./../DB/mysql');

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
