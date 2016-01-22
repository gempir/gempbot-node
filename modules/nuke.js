var fn = require('./functions');
var output = require('./../connection/output');


global.nukeLength = 10;
global.toNuke = [];

function recordToNuke(channel, user, message)
{
    if (!global.NukeMode) {
        return false;
    }

    if (user['user-type'] === 'mod') {
        return false;
    }

    if (typeof global.toNuke === 'undefined') {
		global.toNuke = [];
	}

	var index = global.toNuke.indexOf(user.username);
	if (index > -1) {
		return false;
	}
	global.toNuke.push(user.username);

	setTimeout(function() {
		global.toNuke.splice(index, 1);
	}, global.nukeLength * 1000);
}

function nuke(channel, username, message)
{
    global.NukeMode = true;
    var nukeTime = 1;

    if (message != '!nuke') {
        nukeTime = fn.getNthWord(message, 2);
    }
    if (typeof fn.getNthWord(message, 3) != 'undefined') {
        global.nukeLength = fn.getNthWord(message, 3);
    }

    if (nukeTime > 10) {
        nukeTime = 10;
        output.whisper(username, 'Don\'t make nuke timeouts so long. Timeout will be 10 seconds instead.');
    }
    if (nukeLength > 30) {
        nukeLength = 30;
        output.whisper(username, 'Don\'t make nukes so long. Nuke will be 30 seconds instead.');
    }

    output.sayNoCD(channel, 'VaultBoy THIS CHAT WILL BE NUKED IN ' + global.nukeLength + ' SECONDS VaultBoy', true);

    for (var x = 0; x < (global.nukeLength - 1) ; x++) {
        (function(index) {
            setTimeout(function() {
                output.sayNoCD(channel, index % 2 == 0 ? 'Tick...' : 'Tock...');
            }, index*1000)
        })(x);
    }

    setTimeout(function() {
        for (index = 0; index < global.toNuke.length; index++) {
            output.sayNoCD(channel, '/timeout ' + global.toNuke[index] + ' ' + nukeTime);
        }
        console.log('[LOG] nuking:' + global.toNuke);
        output.sayNoCD(channel, 'VaultBoy NUKED ' + global.toNuke.length + ' CHATTERS VaultBoy', true);
        global.NukeMode = false;
        global.toNuke = [];
        global.nukeLength = 10;
    }, global.nukeLength * 1000);
}


module.exports = {
    nuke,
    recordToNuke
}
