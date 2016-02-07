var request = require('request');
var cfg     = require('./../cfg');

var BetterTTVEmotes = {
    global: [],
    channel: {}
}

function loadBTTVEmotes() {
    loadGlobalBTTVEmotes();
    loadChannelBTTVEmotes();
    console.log('[API] loading bttv emotes'.bgMagenta);
}

function loadGlobalBTTVEmotes() {
    request('https://api.betterttv.net/2/emotes', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var bttvObj = JSON.parse(body);
            var emotes  = bttvObj.emotes;
            for (var i = 0; i < emotes.length; i++) {
                BetterTTVEmotes.global.push(emotes[i].code);
            }
        }
    })
}

function loadChannelBTTVEmotes() {
    var channels = cfg.options.channels;
    console.log(channels);

    for (var i = 0; i < channels.length; i++) {
        var channelCurrent =  channels[i];
        request('https://api.betterttv.net/2/channels/nymn_hs', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var bttvObj = JSON.parse(body);
                var emotes  = bttvObj.emotes;
                BetterTTVEmotes.channel[channelCurrent] = [];
                for (var j = 0; j < emotes.length; j++) {
                    BetterTTVEmotes.channel[channelCurrent].push(emotes[j].code);
                }
            }
        })
    }
}


module.exports = {
    loadBTTVEmotes,
    BetterTTVEmotes
}
