var channel = require('./modules/twitch/channel');
var handler = require('./modules/eventHandler');
require('./modules/logs');
require('./modules/status');
require('./modules/count');
require('./modules/combo');
require('./modules/lines');
require('./modules/db/logUsers');
require('./modules/dungeon/dungeon.js');



channel.client.on('chat', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

channel.client.on('action', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

