var redis = require('./redis');


function incrementUserEmote(channel, username, emote, increase) {
    redis.hincrby(channel + ':emotelog:user:' + emote, username, increase);
}

function incrementEmote(channel, username, emote, increase) {
    redis.hincrby(channel + ':emotelog:channel', emote, increase);
}

module.exports = {
    incrementUserEmote,
    incrementEmote
}
