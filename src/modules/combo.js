var fn     = require('./../controllers/functions');
var emotecache = require('./../models/emotecache');
var cfg        = require('./../../cfg');
var irc        = require('./../controllers/irc');
var config     = require('./../controllers/config');


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

        if (typeof emotecache.bttvemotes['channel'][channel] === 'undefined' || typeof emotecache.bttvemotes.global === 'undefined') {
            return false;
        }

        var messageArr = message.split(' ');
        for (var i = 0; i < messageArr.length; i++) {
            var globalBttv = emotecache.bttvemotes.global;
            for (var j = 0; j < globalBttv.length; j++) {
                if (globalBttv[j] === messageArr[i]) {
                    return messageArr[i];
                }
            }
            var channelBttv = emotecache.bttvemotes['channel'][channel];
            for (var k = 0; k < channelBttv.length; k++) {
                if (channelBttv[k] === messageArr[i]) {
                    return messageArr[i];
                }
            }
        }

    }

}
