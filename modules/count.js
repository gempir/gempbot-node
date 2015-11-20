var twitch = require('./twitch');
var fs = require('graceful-fs');
var fn = require('./functions');

var client = twitch.client;

client.on('chat', function(channel, user, message, self) {
    if (message.substr(0,8) === '!countme' && global.cooldown === false) {
        global.cooldown = true;
        var emote = message.replace('!countme','');
        fs.readFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', function (err, data) {
            var emoteCount = fn.occurrences(data, emote);
            client.say(channel, '@' + user.username + ', you used ' + 'the phrase' + ' ' + emoteCount + ' times');
        });
    }
});


client.on('chat', function(channel, user, message, self) {
    if (message.substr(0,6) === '!count' && global.cooldown === false) {
        global.cooldown = true;
        var searchWord = message.replace('!count','');
        fs.readFile('logs/' + channel.substr(1) + '.txt', function (err, data) {
            var emoteCount = fn.occurrences(data, searchWord);
            client.say(channel, '@' + user.username + ', chat used ' + 'the phrase' + ' ' + emoteCount + ' times');
        });
    }
});