var fn = require('./functions');
var output = require('./../connection/output');



function recordToNuke(channel, username, message)
{
    if (typeof global.toNuke === 'undefined') {
		global.toNuke = [];
	}

	var index = global.toNuke.indexOf(username);
	if (index > -1) {
		return false;
	}
	global.toNuke.push(username);

	setTimeout(function() {
		global.toNuke.splice(index, 1);
	}, 5000);
}

function nuke(channel, username, message)
{
    var nukeTime = 1;
    var nukingIn = 5;

    if (message != '!nuke') {
        nukeTime = fn.getNthWord(message, 2);
    }
    if (typeof fn.getNthWord(message, 3) != 'undefined') {
        nukingIn = fn.getNthWord(message, 3);
    }

    output.sayNoCD(channel, 'MrDestructoid THIS CHAT WILL BE NUKED IN ' + nukingIn + ' SECONDS', true);

    setTimeout(function() {
        for (index = 0; index < global.toNuke.length; index++) {
            output.sayNoCD(channel, '/timeout ' + global.toNuke[index] + ' ' + nukeTime);
            output.sayNoCD(channel, 'MrDestructoid NUKED ' + global.toNuke.length + ' CHATTERS', true);
            global.toNuke = [];
        }
    }, nukingIn * 1000);
}


module.exports = {
    nuke,
    recordToNuke
}
