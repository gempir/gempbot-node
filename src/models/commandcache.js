var cfg   = require('./../../cfg');
var redis = require('./redis');


var channelCommands = {};

function cacheCommands()
{
    var channels = cfg.options.channels;

    for (var i = 0; i < channels.length; i++) {
        var currentChannel = channels[i];
        redis.hgetall(currentChannel + ':commands', function(err, reply) {
            if (err) { return false; }
            channelCommands[currentChannel] = reply;
        });
    }
}


module.exports = {
    channelCommands,
    cacheCommands
}
