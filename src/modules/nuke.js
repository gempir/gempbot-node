var fn = require('./../controllers/functions');
var output = require('./../connection/output');

var nukeLength = 10;
var toNuke = [];
var nukeMode = false;

function recordToNuke(channel, user, message)
{
    if (!nukeMode) {
        return false;
    }

    if (user['user-type'] === 'mod') {
        return false;
    }

    if (typeof toNuke === 'undefined') {
		toNuke = [];
	}

	var index = toNuke.indexOf(user.username);
	if (index > -1) {
		return false;
	}
	toNuke.push(user.username);

	setTimeout(function() {
		toNuke.splice(index, 1);
	}, nukeLength * 1000);
}

function nuke(channel, username, message)
{
    if (nukeMode) {
        return false;
    }
    nukeMode = true;
    var nukeTime = 1;

    if (message != '!nuke') {
        nukeTime = fn.getNthWord(message, 2);
    }
    if (typeof fn.getNthWord(message, 3) != 'undefined') {
        nukeLength = fn.getNthWord(message, 3);
    }

    if (nukeTime > 10) {
        nukeTime = 10;
        output.whisper(username, 'Don\'t make nuke timeouts so long. Timeout will be 10 seconds instead.');
    }
    if (nukeLength > 30) {
        nukeLength = 30;
        output.whisper(username, 'Don\'t make nukes so long. Nuke will be 30 seconds instead.');
    }

    output.sayNoCD(channel, 'VaultBoy THIS CHAT WILL BE NUKED IN ' + nukeLength + ' SECONDS VaultBoy', true);

    for (var x = 0; x < (nukeLength - 1) ; x++) {
        (function(index) {
            setTimeout(function() {
                if ((index / nukeLength) > 0.68) {
                    output.sayNoCD(channel, index % 2 == 0 ? 'Tock...' : 'Tick...');
                }
            }, index*1000)
        })(x);
    }

    setTimeout(function() {
        for (index = 0; index < toNuke.length; index++) {
            output.sayNoCD(channel, '/timeout ' + toNuke[index] + ' ' + nukeTime);
        }
        console.log('[LOG] nuking:' + toNuke);
        output.sayNoCD(channel, 'VaultBoy NUKED ' + toNuke.length + ' CHATTERS VaultBoy', true);
        nukeMode = false;
        toNuke = [];
        nukeLength = 10;
    }, nukeLength * 1000);
}


module.exports = {
    nuke,
    recordToNuke
}
