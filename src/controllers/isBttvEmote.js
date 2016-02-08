var redis = require('./../../controllers/redis');

function isBttvEmote(channel, emote, callback) {
    redis.hexists('bttvemotes', emote, function(err, reply) {
        if (reply === 1) {
            return callback(true);
        }
    });
    redis.hexists(channel + 'bttvchannelemotes:', emote, function(err, reply) {
        if (reply === 1) {
            return callback(true);
        }
    });
}


module.exports = isBttvEmote;
