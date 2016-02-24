var fn = require('./../controllers/functions');
var output = require('./../connection/output');

var nukeLength = 30;
var activeNukes = [];
var toNuke = {}

function recordToNuke(channel, user, message)
{
    if (!(activeNukes.indexOf(channel) > -1)) {
        return false;
    }

    if (user['user-type'] === 'mod') {
        return false;
    }

    if (typeof toNuke[channel] === 'undefined') {
		toNuke[channel] = [];
	}
    if (toNuke[channel].indexOf(user.username) > -1) {
        return false;
    }
    toNuke[channel].push(user.username);
}

function nuke(channel, username, message)
{
    if (activeNukes.indexOf(channel) > -1) {
        return false;
    }

    activeNukes.push(channel);

    output.sayNoCD(channel, 'VaultBoy THIS CHAT WILL BE NUKED IN 30 SECONDS VaultBoy', true);

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
        if (typeof toNuke[channel] === 'undefined') {
            output.sayNoCD(channel, 'No targets found!');
            return false;
        }

        for (index = 0; index < toNuke[channel].length; index++) {
            output.sayNoCD(channel, '/timeout ' + toNuke[channel][index] + '1');
        }
        console.log('[LOG] nuking:' + toNuke[channel]);
        output.sayNoCD(channel, 'VaultBoy NUKED ' + toNuke[channel].length + ' CHATTERS VaultBoy', true);
        fn.removeFromArray(activeNukes, channel);
        toNuke[channel] = [];
        nukeLength = 30;
    }, nukeLength * 1000);
}


module.exports = {
    nuke,
    recordToNuke
}
