var fn = require('./functions');
var output = require('./../connection/output');



function recordToNuke(channel, user, message)
{
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
	}, 10000);
}

function nuke(channel, username, message)
{
    var nukeTime = 1;

    if (message != '!nuke') {
        nukeTime = fn.getNthWord(message, 2);
    }

    output.sayNoCD(channel, 'VaultBoy THIS CHAT WILL BE NUKED IN 10 SECONDS', true);

    setTimeout(function() {
        for (index = 0; index < global.toNuke.length; index++) {
            output.sayNoCD(channel, '/timeout ' + global.toNuke[index] + ' ' + nukeTime);
            output.sayNoCD(channel, 'VaultBoy NUKED ' + global.toNuke.length + ' CHATTERS', true);
            global.toNuke = [];
        }
    }, 10000);
}


module.exports = {
    nuke,
    recordToNuke
}
