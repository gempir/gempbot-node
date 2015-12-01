var channel = require('./modules/twitch/channel');
var handler = require('./modules/eventHandler');
var git     = require('git-rev-sync');
var cfg     = require('./cfg');
var output  = require('./modules/twitch/output');
require('./modules/logs');
require('./modules/status');
require('./modules/count');
require('./modules/combo');
require('./modules/lines');
require('./modules/db/logUsers');
require('./modules/dungeon/dungeon.js');

// startup 
setTimeout(function() {
	output.say(cfg.options.channels[0], 'Bot starting | branch: ' + git.branch() + ' (' + git.short() + ')');
}, 5000);


channel.client.on('chat', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

channel.client.on('action', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

