var output = require('./twitch/output');
var fs = require('graceful-fs');
var fn = require('./functions');

function count(channel, user, message, whisper) 
{
    var searchPhrase = message.replace('!count','');
        fs.readFile('logs/' + channel.substr(1) + '.txt', function (err, data) {
            var emoteCount = fn.occurrences(data, searchPhrase);
            emoteCount = fn.numberFormatted(emoteCount);
            
            if (fn.stringContainsUrl(searchPhrase) || fn.stringIsLongerThan(searchPhrase, 20)) {
                var phrase = 'the phrase';
            }
            else {
                var phrase = searchPhrase;
            }
            if (whisper) {
                output.whisper(user, 'Chat used ' + phrase + ' ' + emoteCount + ' times');
            }
            else {
                output.say(channel, '@' + user.username + ', chat used ' + phrase + ' ' + emoteCount + ' times');
            }
        });
}

function countMe(channel, username, message, whisper) 
{
    var searchPhrase = message.replace('!countme','');
    fs.readFile('logs/' + channel.substr(1) + '/' + username +'.txt', function (err, data) {
        var emoteCount = fn.occurrences(data, searchPhrase);
        emoteCount = fn.numberFormatted(emoteCount);

        if (fn.stringContainsUrl(searchPhrase) || fn.stringIsLongerThan(searchPhrase, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = searchPhrase;
        }
        if (whisper) {
            output.whisper(username, 'You used ' + phrase + ' ' + emoteCount + ' times');
        }
        else {
            output.say(channel, '@' + username + ', you used ' + phrase + ' ' + emoteCount + ' times');
        }
    });
}

module.exports = 
{
    count,
    countMe
}

