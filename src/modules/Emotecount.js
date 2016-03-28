import fn from './../controllers/functions';

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

        this.bot.models.redis.hget(channel + ":emotelog:channel", emote, (err, obj) => {
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
                var currentEmotes    = user.emotes[emote];
                var emotePosition    = currentEmotes[0];
                var emotePositionArr = emotePosition.split('-');
                var emoteCode        = message.substring(emotePositionArr[0], Number(emotePositionArr[1]) + 1);
                this.bot.models.redis.hincrby(channel + ':emotelog:user:' + emoteCode, user.username, currentEmotes.length);
            }
        }
        //this.countUserBTTVEmotes(channel, user, message);
    }

    countUserBTTVEmotes(channel, user, message) {
        try {
            var messageArr = message.split(' ');

            for (var i = 0; i < messageArr.length; i++) {
                var currentEmote = messageArr[i];
                var channelBttvEmotes = this.bot.bttv.channels[channel];
                var globalBttvEmotes = this.bot.bttv.global;

                if (globalBttvEmotes.indexOf(messageArr[i]) > -1 || channelBttvEmotes.indexOf(messageArr[i]) > -1) {
                    this.bot.models.redis.hincrby(channel + ':emotelog:user:' + messageArr[i], user.username.toLowerCase(), 1);
                }
            }
        } catch (err) {
            console.log(err);
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
                this.bot.models.redis.hincrby(channel + ':emotelog:channel', emoteCode, currentEmotes.length);
            }
        }
        //this.countBTTVEmotes(channel, user, message);
    }

    countBTTVEmotes(channel, user, message) {
        try {
            var messageArr = message.split(' ');
            for (var i = 0; i < messageArr.length; i++) {
                var currentEmote = messageArr[i];
                var channelBttvEmotes = this.bot.bttv.channels[channel];
                var globalBttvEmotes = this.bot.bttv.global;

                if (globalBttvEmotes.indexOf(messageArr[i]) > -1 || channelBttvEmotes.indexOf(messageArr[i]) > -1) {
                    this.bot.models.redis.hincrby(channel + ':emotelog:channel', currentEmote, 1);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}
