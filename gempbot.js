var channel = require('./modules/twitch/channel');
var whisper = require('./modules/twitch/whisper');
var handler = require('./modules/eventHandler');
var git     = require('git-rev-sync');
var cfg     = require('./cfg');
var output  = require('./modules/twitch/output');
require('./modules/logs');
require('./modules/status');
require('./modules/count');
require('./modules/combo');
require('./modules/lines');


channel.client.on('chat', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

channel.client.on('action', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

whisper.group.on('whisper', function (username, message) {
	handler.whisperEventHandler(username, message);
});


channel.client.on("connected", function (address, port) {
	output.say(cfg.options.channels[0], 'Bot starting | branch: ' + git.branch() + ' (' + git.short() + ')');
	console.log('[STARTUP] Bot starting on ' + address + ':' + port + ' | branch: ' + git.branch() + ' (' + git.short() + ')');
});

whisper.group.on("connected", function (address, port) {
	console.log('[STARTUP] Connected to group servers on ' + address + ':' + port);
});


