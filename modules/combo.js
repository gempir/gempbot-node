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
            
            if (fn.stringContainsUrl(lastMessage)) {
                var combo = '...'
            }
            if (fn.stringIsLongerThan(lastMessage, 30)) {
                var combo = fn.getNthWord(lastMessage, 1);
                combo = combo + ' [...]';
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