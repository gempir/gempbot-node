var output = require('./../connection/output');
var fs = require('graceful-fs');
var fn = require('./functions');

function countMe(channel, username, message)
{
    var searchPhrase = message.substr(8);

    fs.readFile('logs/' + channel.substr(1) + '/' + username +'.txt', function (err, data) {
        var emoteCount = occurrences(data, searchPhrase);
        emoteCount = fn.numberFormatted(emoteCount);

        if (fn.stringContainsUrl(searchPhrase) || fn.stringIsLongerThan(searchPhrase, 20)) {
            var phrase = 'the phrase';
        }
        else {
            var phrase = searchPhrase;
        }

        output.say(channel, '@' + username + ', you used ' + phrase + ' ' + emoteCount + ' times');
    });
}


function occurrences(haystack, needle)
{
    var count = 0;
    var position = 0;
    while(true) {
        position = haystack.indexOf(needle, position);
        if( position != -1) {
            count++;
            position += needle.length;
        }
    else{
      break;
    }
  }
  return count;
}

module.exports =
{
    countMe,
}
