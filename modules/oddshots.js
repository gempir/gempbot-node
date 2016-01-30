var cfg    = require('../cfg.js');
var fs     = require('graceful-fs');
var moment = require('moment');
var fn     = require('./functions');
var output = require('./../connection/output');


function saveChannelOddshots(channel, username, message)
{
    var file = 'logs/' + channel.substr(1) + '/oddshots.txt';
    if (!fn.fileExists(file)) {
        fs.appendFile(file, '=== Oddshots for ' + channel + ' ===\n', function(){});
    }
    else if (message.indexOf('http://oddshot.tv/shot/nymn-hs-') > -1) {
        parseOddshots(channel, username, message);
    }
}

function parseOddshots(channel, username, message)
{
    var file = 'logs/' + channel.substr(1) + '/oddshots.txt';
    var regex = 'http://oddshot\.tv\/shot\/nymn-hs-';
    var shot = message.match(regex)
    var oddshot = message.substr(shot.index, shot.index + 39);

    fs.readFile(file, function(err,data) {
        if  (data.indexOf(oddshot) > -1) {
            return false;
        }
        else {
            fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\n', function(){})
        }
    });
    ;
}


module.exports =
{
    saveChannelOddshots
}
