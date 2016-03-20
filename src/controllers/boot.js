var config  = require('./config');
require('./chat');
var emotecache   = require('./../models/emotecache');
var commandcache = require('./../models/commandcache');

commandcache.cacheCommands();
emotecache.fetchEmotesFromBttv(function() {
    emotecache.cacheEmotes();
});
config.cacheConfig();
