var fn     = require('./../controllers/functions');
var output = require('./../connection/output');
var emotecache = require('./../models/emotecache');
var cfg        = require('./../../cfg');

var combos = {};
var lastMessage = '';
var lastEmote = '';

function count(channel, user, message)
{
    if (user.username.toLowerCase() === cfg.options.identity.username.toLowerCase()) {
        return false;
    }
    if (typeof combos[channel] === 'undefined') {
        combos[channel] = {};
        combos[channel]['combo'] = 1;
    }

    var currentMessage = message;
    if (combos[channel]['combo'] < 2) {
        combos[channel]['emote'] = combos[channel]['lastEmote'];
    }
    if (currentMessage.indexOf(combos[channel]['emote']) > -1) {    
        combos[channel]['combo']++;
    }
    else if (combos[channel]['lastEmote'] === '' && !getEmoteFromMessage(channel, user, currentMessage)) {
        combos[channel]['combo']++;
    }
    else if (combos[channel]['combo'] > 2){
        output.say(channel, combos[channel]['combo'] + 'x ' + combos[channel]['emote']  + ' COMBO', true);
        combos[channel]['combo'] = 1;
        combos[channel]['lastEmote'] = '';
    }
    else {
        combos[channel]['combo'] = 1;
        combos[channel]['lastEmote'] = '';
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
                var emoteCode        = message.substring(+emotePositionArr[0], +emotePositionArr[1] + +1);
                return emoteCode;
            }
        }
    }

    var messageArr = message.split(' ');
    for (var i = 0; i < messageArr.length; i++) {
        if (emotecache.bttvemotes.global.indexOf(messageArr[i]) > -1) {
            return messageArr[i];
        }
        if (typeof emotecache.bttvemotes['channel'][channel] != 'undefined') {
            if (emotecache.bttvemotes['channel'][channel].indexOf(messageArr[i]) > 1) {
                return messageArr[i];
            }
        }
    }

}


module.exports =
{
    count
}
