var fn     = require('./../controllers/functions');
var emotecache = require('./../models/emotecache');
var cfg        = require('./../../cfg');
var irc        = require('./../controllers/irc');
var config     = require('./../controllers/config');

var combos = {};
var lastMessage = '';
var lastEmote = '';

function count(channel, user, message)
{
    message = ' ' + message + ' ';

    if (typeof combos[channel] === 'undefined') {
        combos[channel] = {};
        combos[channel]['combo'] = 1;
        combos[channel]['comboStarter'] = 1;
    }

    var currentMessage = message;

    if (combos[channel]['comboStarter'] < 2) {
        combos[channel]['emote'] = combos[channel]['lastEmote'];
    }

    if (currentMessage.indexOf(combos[channel]['lastEmote']) > -1) {
        combos[channel]['comboStarter']++;
    }

    if (currentMessage.indexOf(' ' + combos[channel]['emote'] + ' ') > -1) {
        combos[channel]['combo']++;
    }
    else if (combos[channel]['lastEmote'] === '' && !getEmoteFromMessage(channel, user, currentMessage)) {
        combos[channel]['combo']++;
    }
    else if (combos[channel]['combo'] > 4){
        if (typeof config.config[channel] == 'undefined' || config.config[channel] == null) {
            return false;
        }
        if (config.config[channel].combos == 1) {
            irc.say(channel, combos[channel]['combo'] + 'x ' + combos[channel]['emote']  + ' COMBO', true);
        }
        combos[channel]['combo']        = 1;
        combos[channel]['comboStarter'] = 1;
        combos[channel]['lastEmote']    = '';
        combos[channel]['emote']        = '';
    }
    else {
        combos[channel]['combo']        = 1;
        combos[channel]['comboStarter'] = 1;
        combos[channel]['lastEmote']    = '';
        combos[channel]['emote']        = '';
    }
    combos[channel]['lastEmote'] = getEmoteFromMessage(channel, user, currentMessage);
}

function getEmoteFromMessage(channel, user, message)
{
    if (user.emotes != null) {
        if (user.emotes.length > 1) {
            return false;
        }
        else {
            for (emote in user.emotes) {

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


module.exports =
{
    count
}
