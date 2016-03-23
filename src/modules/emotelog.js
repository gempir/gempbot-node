var redis              = require('./../models/redis');
var emotecache         = require('./../models/emotecache');

function incrementUserEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (var emote in user.emotes) {
            var currentEmotes = user.emotes[emote];
            var emotePosition    = currentEmotes[0];
            var emotePositionArr = emotePosition.split('-');
            var emoteCode        = message.substring(+emotePositionArr[0], +emotePositionArr[1] + +1);
            redis.hincrby(channel + ':emotelog:user:' + emoteCode, user.username.toLowerCase(), currentEmotes.length);
        }
    }
    countUserBTTVEmotes(channel, user, message);
}

function countUserBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');

    for (var i = 0; i < messageArr.length; i++) {
        var currentEmote = messageArr[i];
        var channelBttvEmotes = emotecache.bttvemotes.channel[channel];
        var globalBttvEmotes = emotecache.bttvemotes.global;
        if (typeof channelBttvEmotes === 'undefined') {
            return false;
        }
        if (Object.keys(emotecache.bttvemotes.channel).length === 0 || globalBttvEmotes.length === 0) {
            return false;
        }
        if (globalBttvEmotes.indexOf(messageArr[i]) > -1 || channelBttvEmotes.indexOf(messageArr[i]) > -1) {
            redis.hincrby(channel + ':emotelog:user:' + messageArr[i], user.username.toLowerCase(), 1);
        }
    }
}

function incrementEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (var emote in user.emotes) {
            var currentEmotes = user.emotes[emote];
            var emotePosition    = currentEmotes[0];
            var emotePositionArr = emotePosition.split('-');
            var emoteCode        = message.substring(+emotePositionArr[0], +emotePositionArr[1] + +1);
            redis.hincrby(channel + ':emotelog:channel', emoteCode, currentEmotes.length);
        }
    }
    countBTTVEmotes(channel, user, message);
}

function countBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');
    for (var i = 0; i < messageArr.length; i++) {
        var currentEmote = messageArr[i];
        var channelBttvEmotes = emotecache.bttvemotes.channel[channel];
        var globalBttvEmotes = emotecache.bttvemotes.global;
        if (typeof channelBttvEmotes === 'undefined') {
            return false;
        }
        if (Object.keys(emotecache.bttvemotes.channel).length === 0 || globalBttvEmotes.length === 0) {
            return false;
        }
        if (globalBttvEmotes.indexOf(messageArr[i]) > -1 || channelBttvEmotes.indexOf(messageArr[i]) > -1) {
            redis.hincrby(channel + ':emotelog:channel', currentEmote, 1);
        }
    }
}


module.exports = {
    incrementUserEmote,
    incrementEmote
}
