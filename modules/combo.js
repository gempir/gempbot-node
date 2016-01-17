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

    if (counter === 1) {
        comboWord = fn.getNthWord(message, 1);
    }

    if (currentMessage.indexOf(comboWord) === -1) {
        if ( counter > 2) {
            if (fn.stringContainsUrl(lastMessage)) {
                skip = true;
            }
            if (fn.stringIsLongerThan(lastMessage, 30)) {
                skip = true;
            }
            if (!skip) {
                var comboTotal = counter;
                counter = 1;
                output.sayNoCD(channel, (comboTotal - 1) + 'x ' + comboWord + ' COMBO', true);
                return;
            }
        }
        counter = 1;
    }
    else if (currentMessage.indexOf(comboWord) > -1) {
        counter++;
    }
    lastMessage = message;
}


module.exports =
{
    count
}
