var fn     = require('./functions');
var output = require('./twitch/output');


var lastMessage = '';
var currentMessage = '';
var counter = 1;

function count(channel, user, message)
{
    var currentMessage = message;

    if (currentMessage != lastMessage) {
        if ( counter > 2) {
            if (fn.stringIsLongerThan(lastMessage, 30) || fn.stringContainsUrl(lastMessage)) {
                return false;
            }
            else {
                var combo = lastMessage;
            }
            output.say(channel, counter + 'x ' + combo + ' COMBO', true);
        }
        counter = 1;
    }
    if (currentMessage.toLowerCase() === lastMessage.toLowerCase()) {
        counter++;
    }
    lastMessage = message; 
}


module.exports = 
{
    count
}