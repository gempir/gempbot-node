var config  = require('./config');
require('./chat');
var cfg          = require('./../../cfg');
var channel      = require('./../connection/channel');
var whisper      = require('./../connection/whisper');
var output       = require('./../connection/output');
var emotecache   = require('./../models/emotecache');
var commandcache = require('./../models/commandcache');

// boot
emotecache.cacheEmotes();
commandcache.cacheCommands();

channel.client.on("connected", function (address, port) {
    console.log('[boot] connected to chat');
    output.sayAllChannels('Bot starting up');
});

whisper.group.on("connected", function (address, port, err) {
    console.log('[boot] Connected to group servers on ' + address + ':' + port);
});

whisper.group.on("disconnected", function (reason) {
    console.log('[boot] group server connection failed | ' + reason)
    whisper.group.connect();
});

channel.client.on("disconnected", function (reason) {
    console.log('[boot] chat server connection failed | ' + reason)
    channel.client.connect();
});
