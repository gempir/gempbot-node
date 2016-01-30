var cfg    = require('../cfg.js');
var fs     = require('graceful-fs');
var moment = require('moment');
var fn     = require('./functions');
var output = require('./../connection/output');


function saveChannelOddshots(channel, username, message)
{
    if (message.indexOf('oddshot.tv/shot/nymn-hs') > -1) {
        var file = 'logs/' + channel.substr(1) + '/oddshots.txt';
        fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\n', function(){});
    }
}


module.exports =
{
    saveChannelOddshots
}
