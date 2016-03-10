var config  = require('./config');
require('./chat');
var cfg          = require('./../../cfg');
var channel      = require('./../connection/channel');
var irc          = require('./../connection/irc');
var whisper      = require('./../connection/whisper');
var output       = require('./../connection/output');
var emotecache   = require('./../models/emotecache');
var commandcache = require('./../models/commandcache');

commandcache.cacheCommands();
emotecache.cacheEmotes();
config.cacheConfig();

channel.client.on("connected", function (address, port) {
    console.log('[boot] connected to chat');
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
