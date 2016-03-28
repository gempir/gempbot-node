export default class Combo {

    constructor(bot)
    {
        this.bot         = bot;
        this.combos      = {};
        this.lastMessage = '';
        this.lastEmote   = ''
    }

    count(channel, user, message)
    {
        message = ' ' + message + ' ';

        if (typeof this.combos[channel] === 'undefined') {
            this.combos[channel] = {};
            this.combos[channel]['combo'] = 1;
            this.combos[channel]['comboStarter'] = 1;
        }

        var currentMessage = message;

        if (this.combos[channel]['comboStarter'] < 2) {
            this.combos[channel]['emote'] = this.combos[channel]['lastEmote'];
        }

        if (currentMessage.indexOf(this.combos[channel]['lastEmote']) > -1) {
            this.combos[channel]['comboStarter']++;
        }

        if (currentMessage.indexOf(' ' + this.combos[channel]['emote'] + ' ') > -1) {
            this.combos[channel]['combo']++;
        }
        else if (this.combos[channel]['lastEmote'] === '' && !this.getEmoteFromMessage(channel, user, currentMessage)) {
            this.combos[channel]['combo']++;
        }
        else if (this.combos[channel]['combo'] > 4){
            try {
                if (this.bot.channels[channel].config.combos == 1 || this.bot.channels[channel].config.combo == 1) {
                    this.bot.say(channel, '/me '+  this.combos[channel]['emote'] + ' x ' + this.combos[channel]['combo'] + ' COMBO');
                }
                this.combos[channel]['combo']        = 1;
                this.combos[channel]['comboStarter'] = 1;
                this.combos[channel]['lastEmote']    = '';
                this.combos[channel]['emote']        = '';
            } catch (err) {
                console.log(err);
            }
        }
        else {
            this.combos[channel]['combo']        = 1;
            this.combos[channel]['comboStarter'] = 1;
            this.combos[channel]['lastEmote']    = '';
            this.combos[channel]['emote']        = '';
        }
        this.combos[channel]['lastEmote'] = this.getEmoteFromMessage(channel, user, currentMessage);
    }

    getEmoteFromMessage(channel, user, message)
    {
        if (user.emotes != null) {
            if (user.emotes.length > 1) {
                return false;
            }
            else {
                for (var emote in user.emotes) {

                    var currentEmotes = user.emotes[emote];
                    var emotePosition    = currentEmotes[0];
                    var emotePositionArr = emotePosition.split('-');
                    var emoteCode        = message.replace(' ', '').substring(+emotePositionArr[0], parseInt(emotePositionArr[1]) + 1);
                    return emoteCode;
                }
            }
        }
        try {
            message = message.trim();
            var messageArr = message.split(' ');
            for (var i = 0; i < messageArr.length; i++) {
                var globalBttv = this.bot.bttv.global;
                if (globalBttv.indexOf(messageArr[i]) > -1) {
                    return messageArr[i];
                }
                var channelBttv = this.bot.bttv.channels[channel];
                if (channelBttv.indexOf(messageArr[i]) > -1) {
                    return messageArr[i];
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

}
