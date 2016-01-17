var fn     = require('./functions');
var output = require('./../connection/output');


var lastMessage = '';
var currentMessage = '';
var counter = 1;
var skip = false;

function count(channel, user, message)
{
    currentMessage = message;
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
                var comboTotal = counter;
                counter = 1;
                output.sayNoCD(channel, comboTotal + 'x ' + combo + ' COMBO', true);
                return;
            }
        }
        counter = 1;
    }
    else if (currentMessage === lastMessage) {
        counter++;
    }
    lastMessage = message;
}


module.exports =
{
    count
}
