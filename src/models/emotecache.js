var cfg   = require('./../../cfg');
var redis = require('./redis');
var request = require('request');

var bttvemotes = {
    global: [],
    channel: {}
}

function fetchEmotesFromBttv(callback) {
    console.log('[API] fetching bttv emotes');
    cacheGlobalBTTVEmotesToRedis(function() {
        cacheChannelBTTVEmotesToRedis(function() {
            return callback();
        });
    });
}

function cacheGlobalBTTVEmotesToRedis(callback) {
    request('https://api.betterttv.net/2/emotes', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bttvObj = JSON.parse(body);
            var emotes  = bttvObj.emotes;
            for (var i = 0; i < emotes.length; i++) {
                redis.hset('bttvemotes', emotes[i].code, emotes[i].id);
                bttvemotes.global.push(emotes[i].code);
            }
            return callback();
        }
    })
}

function cacheChannelBTTVEmotesToRedis(callback) {
    var channels = cfg.options.channels;
    for (var i = 0; i < channels.length; i++) {
        var channelCurrent =  channels[i];
        request('https://api.betterttv.net/2/channels/' + channelCurrent.substr(1), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var bttvObj = JSON.parse(body);
                var emotes  = bttvObj.emotes;
                for (var j = 0; j < emotes.length; j++) {
                    redis.hset(channelCurrent + ':bttvchannelemotes', emotes[j].code, emotes[j].id);
                    bttvemotes.channel[channelCurrent] = emotes[j].code;
                }
                return callback();
            }
        })
    }
}

function cacheEmotes() {
    redis.hgetall('bttvemotes', function(err, reply) {
        if (err) {
            console.log('[redis] ' + err);
            return false;
        }
        bttvemotes.global = Object.keys(reply);
        var channels = cfg.options.channels;
        for (var i = 0; i < channels.length; i++) {
            var channelCurrent =  channels[i];
            redis.hgetall(channelCurrent + ':bttvchannelemotes', function(err, reply) {
                if (reply != null) {
                    bttvemotes['channel'][channelCurrent] = Object.keys(reply);
                }
            });
        }
    });
}

(function emoteCacheInterval(){
    setInterval(function(){
        cacheEmotes();
    }, 1800000);
})();


module.exports = {
    cacheEmotes,
    bttvemotes,
    fetchEmotesFromBttv
};
