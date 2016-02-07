var request = require('request');

var TwitchEmotes = {};



function loadTwitchEmotes(callback){
    console.log('[API] loading twitch emotes'.bgMagenta);
    loadGlobalTwitchEmotes();
    loadSubTwitchEmotes(function(){
        return callback();
    });
}

function loadGlobalTwitchEmotes() {
    request('https://twitchemotes.com/api_cache/v2/global.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var twitchObj = JSON.parse(body);
            var emotes  = twitchObj.emotes;
            for (emote in emotes) {
                TwitchEmotes[emotes[emote].image_id] = emote;
            }
        }
    })
}

function loadSubTwitchEmotes(callback) {
    request('https://twitchemotes.com/api_cache/v2/subscriber.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var twitchObj = JSON.parse(body);
            for (channel in twitchObj.channels) {
                for (var i = 0; i < twitchObj.channels[channel].emotes.length; i++ ) {
                    currentChannelEmotes = twitchObj.channels[channel].emotes[i];
                    TwitchEmotes[currentChannelEmotes.image_id] = currentChannelEmotes.code;
                }
            }
            return callback();
        }
    })
}

module.exports = {
    loadTwitchEmotes,
    TwitchEmotes
}
