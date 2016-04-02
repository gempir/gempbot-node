import lib from './../lib';

export default class Emotecount
{

    constructor(bot)
    {
        this.bot = bot;
    }

    countMe(channel, username, emote, prefix)
    {
        emote = emote.replace(' ', '');
        this.bot.redis.hget(channel + ":emotecount:" + emote, username, (err, obj) => {
            if (obj === null || err) {
                console.log('[emotecount] ', obj, err);
                return false;
            }
            this.bot.say(channel, prefix + emote + ' has been used ' + lib.numberFormatted(obj) + ' times by you');
        });
    }


    count(channel, username, emote, prefix)
    {
        emote = emote.replace(' ', '');
        this.bot.redis.hget(channel + ":emotecount:" + emote, 'channel', (err, obj) => {
            if (obj === null || err) {
                console.log('[emotecount] ', obj, err);
                return false;
            }
            this.bot.say(channel, prefix + emote + ' has been used ' + lib.numberFormatted(obj) + ' times');
        });

    }

    incrementEmotes(channel, user, message)
    {
        if (user.emotes != null) {
            for (var emote in user.emotes) {
                var currentEmotes    = user.emotes[emote];
                var emotePosition    = currentEmotes[0];
                var emotePositionArr = emotePosition.split('-');
                var emoteStart       = emotePositionArr[0];
                var emoteEnd         = emotePositionArr[1];
                emoteEnd++;
                var emoteCode        = message.substring(emoteStart, emoteEnd);
                if (emoteCode.indexOf(' ') > -1) {
                    continue;
                }
                this.bot.redis.hincrby(channel + ':emotecount:' + emoteCode, user.username, currentEmotes.length);
                this.bot.redis.hincrby(channel + ':emotecount:' + emoteCode, 'channel', currentEmotes.length);
            }
        }
        this.countBTTVEmotes(channel, user, message);
    }

    countBTTVEmotes(channel, user, message) {
        try {
            var messageArr = message.split(' ');

            for (var i = 0; i < messageArr.length; i++) {

                var currentEmote = messageArr[i];
                var channelBttvEmotes = this.bot.bttv.channels[channel];
                var globalBttvEmotes = this.bot.bttv.global;

                if (globalBttvEmotes.indexOf(messageArr[i]) > -1 || channelBttvEmotes.indexOf(messageArr[i]) > -1) {
                    if (messageArr[i].indexOf(' ') > -1) {
                        continue;
                    }
                    this.bot.redis.hincrby(channel + ':emotecount:' + messageArr[i], user.username, 1);
                    this.bot.redis.hincrby(channel + ':emotecount:' + currentEmote, 'channel', 1);
                }

            }
        } catch (err) {
            console.log(err);
        }
    }

}
