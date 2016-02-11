var output = require('./../connection/output');
var fs = require('graceful-fs');
var fn = require('./../controllers/functions');
var redis = require('./../models/redis');

function countMe(channel, username, message, callback)
{
    var emote = message.substr(8);
    emote = emote.replace(' ', '');

    redis.hget(channel + ":emotelog:user:" + emote, username, function (err, obj) {
        if (obj === null) {
            return false;
        }
        if (fn.stringContainsUrl(emote) || fn.stringIsLongerThan(emote, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = emote;
        }
        return callback({
            channel: channel,
            message: '@' + username + ', you used ' + phrase + ' ' + obj + ' times'
        });
    });

}


function count(channel, username, message, callback)
{
    var emote = message.substr(6);
    emote = emote.replace(' ', '');

    redis.hget(channel + ":emotelog:channel", emote, function (err, obj) {
        if (obj === null) {
            return false;
        }
        if (fn.stringContainsUrl(emote) || fn.stringIsLongerThan(emote, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = emote;
        }
        return callback({
            channel: channel,
            message: 'Chat used ' + phrase + ' ' + obj + ' times'
        });
    });

}

module.exports =
{
    countMe,
    count
}
