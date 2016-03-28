var fs = require('fs');
var fn = require('./../controllers/functions');
var redis = require('./../models/redis');
var emotecache         = require('./../models/emotecache');

export default class Emotecount
{

    constructor(bot)
    {
        this.bot = bot;
    }

    countMe(channel, username, emote, prefix)
    {
        emote = emote.replace(' ', '');

        this.bot.models.redis.hget(channel + ":emotelog:user:" + emote, username, (err, obj) => {
            if (obj === null) {
                return false;
            }
            if (fn.stringContainsUrl(emote) || fn.stringIsLongerThan(emote, 20)) {
                var phrase = 'the phrase';
            }
            else {
                var phrase = emote;
            }
            this.bot.say(channel, prefix + phrase + ' has been used ' + fn.numberFormatted(obj) + ' times by you');
        });
    }


    count(channel, username, emote, prefix)
    {
        emote = emote.replace(' ', '');

        redis.hget(channel + ":emotelog:channel", emote, (err, obj) => {
            if (obj === null) {
                return false;
            }
            if (fn.stringContainsUrl(emote) || fn.stringIsLongerThan(emote, 20)) {
                var phrase = 'the phrase';
            }
            else {
                var phrase = emote;
            }
            this.bot.say(channel, prefix + phrase + ' has been used ' + fn.numberFormatted(obj) + ' times');
        });

    }

    incrementUserEmote(channel, user, message)
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
        this.countUserBTTVEmotes(channel, user, message);
    }

    countUserBTTVEmotes(channel, user, message) {
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

    incrementEmote(channel, user, message)
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
        this.countBTTVEmotes(channel, user, message);
    }

    countBTTVEmotes(channel, user, message) {
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
}
