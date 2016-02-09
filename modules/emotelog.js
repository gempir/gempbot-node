var emotelogController = require('./../controllers/emotelogController');
var isBttvEmote        = require('./../src/controllers/isBttvEmote');
var redis              = require('./../controllers/redis');

function incrementUserEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (emote in user.emotes) {
            var currentEmotes = user.emotes[emote];
            var emotePosition    = currentEmotes[0];
            var emotePositionArr = emotePosition.split('-');
            var emoteCode        = message.substring(+emotePositionArr[0], +emotePositionArr[1] + +1);
            emotelogController.incrementUserEmote(channel, user.username.toLowerCase(), emoteCode, currentEmotes.length);
        }
    }
    countUserBTTVEmotes(channel, user, message);
}

function countUserBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');

    for (var i = 0; i < messageArr.length; i++) {
        var currentEmote = messageArr[i];
        isBttvEmote(channel, messageArr[i], function(isEmote) {
            if (isEmote) {
                emotelogController.incrementUserEmote(channel, user.username.toLowerCase(), currentEmote, 1);
            }
        });
    }
}

function incrementEmote(channel, user, message)
{
    if (user.emotes != null) {
        for (emote in user.emotes) {
            var currentEmotes = user.emotes[emote];
            var emotePosition    = currentEmotes[0];
            var emotePositionArr = emotePosition.split('-');
            var emoteCode        = message.substring(+emotePositionArr[0], +emotePositionArr[1] + +1);
            emotelogController.incrementEmote(channel, user.username.toLowerCase(), emoteCode, currentEmotes.length);
        }
    }
    countBTTVEmotes(channel, user, message);
}

function countBTTVEmotes(channel, user, message) {
    var messageArr = message.split(' ');
    for (var i = 0; i < messageArr.length; i++) {
        var currentEmote = messageArr[i];
        isBttvEmote(channel, messageArr[i], function(isEmote){
            if (isEmote) {
                emotelogController.incrementEmote(channel, user.username.toLowerCase(), currentEmote, 1);
            }
        });
    }
}


module.exports = {
    incrementUserEmote,
    incrementEmote
}
