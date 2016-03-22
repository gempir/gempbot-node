var cfg   = require('./../../cfg');
var config = require('./../controllers/config');
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
    var channels = config.channels;
    var channel  = '';
    var channelCurrent = '';
        for (var i = 0; i < channels.length; i++) {
            channelCurrent =  channels[i];
            (function(channelCurrent) {
                request('https://api.betterttv.net/2/channels/' + channelCurrent.substr(1), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var bttvObj = JSON.parse(body);
                    var emotes  = bttvObj.emotes;
                    for (var j = 0; j < emotes.length; j++) {
                        redis.hset(channelCurrent + ':bttvchannelemotes', emotes[j].code, emotes[j].id);
                    }
                    return callback();
                }
                });
            })(channelCurrent);
        }
    cacheEmotes();
}

function cacheEmotes() {
    redis.hgetall('bttvemotes', function(err, reply) {
        if (err) {
            console.log('[redis] ' + err);
            return false;
        }
        if (reply == null) {
            return false;
        }
        bttvemotes.global = Object.keys(reply);
        var channels = config.channels;
        for (var y = 0; y < channels.length; y++) {
            (function(y) {
                redis.hgetall(channels[y] + ':bttvchannelemotes', function(err, reply) {
                    if (err) {
                        return false;
                    }
                    if (reply != null) {
                        bttvemotes.channel[channels[y]] = Object.keys(reply);
                    }
                });
            })(y);
        }
    });
}

module.exports = {
    cacheEmotes,
    bttvemotes,
    fetchEmotesFromBttv
};
