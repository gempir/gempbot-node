var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var handler = require('./../modules/eventHandler');


channel.client.on('chat', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

channel.client.on('action', function(channel, user, message, self) {
    handler.channelEventHandler(channel, user, message, self);
});

whisper.group.on('whisper', function (username, message) {
	handler.whisperEventHandler(username, message);
});
