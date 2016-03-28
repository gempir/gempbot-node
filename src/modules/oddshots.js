import fs     from 'fs';
import moment from 'moment';
import fn     from './../controllers/functions';


function saveChannelOddshots(channel, username, message)
{
    var file = '../logs/' + channel.substr(1) + '/oddshots.txt';
    var oddshotChannel = channel.substr(1);

    if (channel.indexOf('_') > -1) {
        var channelSplit = channel.substr(1).split('_');
        oddshotChannel = channelSplit[0] + '-' + channelSplit[1];
    }

    if (!fn.fileExists(file)) {
        fs.appendFile(file, '=== Oddshots for ' + channel + ' ===\n', function(){});
    }
    else if (message.indexOf('http://oddshot.tv/shot/' + oddshotChannel) > -1) {
        parseOddshots(channel, username, message);
    }
}

function parseOddshots(channel, username, message)
{
    console.log("parsing Oddshots: ", channel, username, message);
    var file = '../logs/' + channel.substr(1) + '/oddshots.txt';
    var messageSplit = message.split(' ');

    for (var i = 0; i < (messageSplit.length -1); i++) {
        fs.readFile(file, function(err, data) {
            if  (!(data.indexOf(messageSplit[i]) > -1)) {
                fs.appendFile(file, '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + username + ': ' + message + '\n', function(){})
                return true;
            }
        });
    }
}

module.exports =
{
    saveChannelOddshots
}
