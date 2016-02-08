var emotelogController = require('./../controllers/emotelogController');
var bttv               = require('./../controllers/getBTTVEmotes');
var twitch             = require('./../controllers/getTwitchEmotes');

function incrementUserEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (emote in user.emotes) {
            var emoteCode = twitch.TwitchEmotes[emote];
            emotelogController.incrementUserEmote(channel, user.username.toLowerCase(), emoteCode, user.emotes[emote].length)
        }
    }
    countUserBTTVEmotes(channel, user, message);
}


function countUserBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');

    for (var i = 0; i < messageArr.length; i++) {
        if (bttv.BetterTTVEmotes.global.indexOf(messageArr[i]) > -1 || bttv.BetterTTVEmotes.channel[channel].indexOf(messageArr[i]) > -1) {
            emotelogController.incrementUserEmote(channel, user.username.toLowerCase(), messageArr[i], 1);
        }
    }
}


function incrementEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (emote in user.emotes) {
            var emoteCode = twitch.TwitchEmotes[emote];
            emotelogController.incrementEmote(channel, user.username.toLowerCase(), emoteCode, user.emotes[emote].length)
        }
    }
    countBTTVEmotes(channel, user, message);
}

function countBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');
    for (var i = 0; i < messageArr.length; i++) {
        if (bttv.BetterTTVEmotes.global.indexOf(messageArr[i]) > -1 || bttv.BetterTTVEmotes.channel[channel].indexOf(messageArr[i]) > -1) {
            emotelogController.incrementEmote(channel, user.username.toLowerCase(), messageArr[i], 1);
        }
    }
}


module.exports = {
    incrementUserEmote,
    incrementEmote
}
