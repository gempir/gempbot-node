var config  = require('./config');
var commands = require('./commands');
require('./chat');
var git     = require('git-rev-sync');
var cfg     = require('./../cfg');
var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var output  = require('./../connection/output');

// stuff to do on boot
config.refreshTrusted();
config.setCooldowns();
commands.refreshActiveCommands();

channel.client.on("connected", function (address, port) {
	console.log('[BOOT] Bot starting on ' + address + ':' + port + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
});

whisper.group.on("connected", function (address, port, err) {
	output.say(cfg.options.channels[0], 'Bot starting | branch: ' + git.branch() + ' (' + git.short() + ')');
	console.log('[BOOT] Connected to group servers on ' + address + ':' + port);
});

whisper.group.on("disconnected", function (reason) {
    process.exit(); // restart bot when not connected to group servers, because whispers won't work otherwise
});
