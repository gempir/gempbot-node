var output = require('./twitch/output');
var fs = require('graceful-fs');
var fn = require('./functions');

function count(channel, user, message) 
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
            output.say(channel, '@' + user.username + ', chat used ' + phrase + ' ' + emoteCount + ' times');
        });
}

function countMe(channel, user, message) 
{
    var searchPhrase = message.replace('!countme','');
    fs.readFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', function (err, data) {
        var emoteCount = fn.occurrences(data, searchPhrase);
        emoteCount = fn.numberFormatted(emoteCount);

        if (fn.stringContainsUrl(searchPhrase) || fn.stringIsLongerThan(searchPhrase, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = searchPhrase;
        }

        output.say(channel, '@' + user.username + ', you used ' + phrase + ' ' + emoteCount + ' times');
    });
}

module.exports = 
{
    count,
    countMe
}

