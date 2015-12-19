var fn     = require('./functions');
var output = require('./twitch/output');


var lastMessage = '';
var currentMessage = '';
var counter = 1;
var skip = false;

function count(channel, user, message)
{
    var currentMessage = message;
    skip = false;

    if (currentMessage != lastMessage) {
        if ( counter > 2) {
            
            if (fn.stringContainsUrl(lastMessage)) {
                skip = true;
            }
            if (fn.stringIsLongerThan(lastMessage, 30)) {
                skip = true;
            }
            else {
                var combo = lastMessage;
            }
            if (!skip) {
                output.say(channel, counter + 'x ' + combo + ' COMBO', true);
            }
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