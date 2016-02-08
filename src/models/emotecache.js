var cfg   = require('./../../cfg');
var redis = require('./../../controllers/redis');
var request = require('request');

function cacheEmotesToRedis() {
    console.log('[API] caching bttv and twitch emotes to redis'.bgMagenta);
    cacheGlobalBTTVEmotesToRedis();
    cacheChannelBTTVEmotesToRedis();
    cacheGlobalTwitchEmotesToRedis();
    cacheSubTwitchEmotesToRedis();
}

function cacheGlobalBTTVEmotesToRedis() {
    request('https://api.betterttv.net/2/emotes', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bttvObj = JSON.parse(body);
            var emotes  = bttvObj.emotes;
            for (var i = 0; i < emotes.length; i++) {
                redis.hset('bttvemotes', emotes[i].code, emotes[i].id);
            }
        }
    })
}

function cacheChannelBTTVEmotesToRedis() {
    var channels = cfg.options.channels;
    for (var i = 0; i < channels.length; i++) {
        var channelCurrent =  channels[i];
        request('https://api.betterttv.net/2/channels/nymn_hs', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var bttvObj = JSON.parse(body);
                var emotes  = bttvObj.emotes;
                for (var j = 0; j < emotes.length; j++) {
                    redis.hset(channelCurrent + ':bttvchannelemotes', emotes[j].code, emotes[j].id);
                }
            }
        })
    }
}


function cacheGlobalTwitchEmotesToRedis() {
    request('https://twitchemotes.com/api_cache/v2/global.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var twitchObj = JSON.parse(body);
            var emotes  = twitchObj.emotes;
            for (emote in emotes) {
                redis.hset('twitchemotes', emote, emotes[emote].image_id);
                redis.hset('twitchemotesreverse', emotes[emote].image_id, emote);
            }
        }
    })
}

function cacheSubTwitchEmotesToRedis() {
    request('https://twitchemotes.com/api_cache/v2/subscriber.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var twitchObj = JSON.parse(body);
            for (channel in twitchObj.channels) {
                for (var i = 0; i < twitchObj.channels[channel].emotes.length; i++ ) {
                    currentChannelEmotes = twitchObj.channels[channel].emotes[i];
                    redis.hset('twitchemotes', currentChannelEmotes.code, currentChannelEmotes.image_id);
                }
            }
        }
    })
}

module.exports = cacheEmotesToRedis;
