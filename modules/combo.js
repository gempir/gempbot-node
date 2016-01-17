var fn     = require('./functions');
var output = require('./../connection/output');
var cfg    = require('./../cfg');


var lastMessage = '';
var currentMessage = '';
var comboWord = '';
var counter = 1;
var skip = false;

function count(channel, user, message)
{
    if (user.username.toLowerCase() === cfg.options.identity.username.toLowerCase()) {
        return false;
    }
    currentMessage = message;
    skip = false;
    console.log(counter);
    if (counter === 1) {
        comboWord = message;
    }
    if (currentMessage.indexOf(lastMessage) === -1) {
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
                output.sayNoCD(channel, comboTotal + 'x ' + comboWord + ' COMBO', true);
                return;
            }
        }
        counter = 1;
    }
    else if (currentMessage.indexOf(lastMessage) > -1) {
        counter++;
    }
    lastMessage = message;
}


module.exports =
{
    count
}
