var config  = require('./config');
require('./chat');
var git     = require('git-rev-sync');
var cfg     = require('./../cfg');
var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var output  = require('./../connection/output');

// stuff to do on boot
config.refreshTrusted();
config.setCooldowns();

channel.client.on("connected", function (address, port) {
	output.say(cfg.options.channels[0], 'Bot starting | branch: ' + git.branch() + ' (' + git.short() + ')');
	console.log('[STARTUP] Bot starting on ' + address + ':' + port + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
});

whisper.group.on("connected", function (address, port, err) {
	console.log('[STARTUP] Connected to group servers on ' + address + ':' + port);
});

whisper.group.on("disconnected", function (reason) {
    // process.exit(); // restart bot when not connected to group servers, because whispers won't work otherwise
});
