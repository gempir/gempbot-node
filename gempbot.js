var irc = require('tmi.js'); 
var moment = require('moment');
var fs = require('graceful-fs')

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
      'api_dev_key' : 'pastebin-API-Key', // change, get from pastebin.com/api
      'api_user_name' : 'pastebin-username', // change
      'api_user_password' : 'pastebin-password' // change
    });

var admin = 'gempir'; // change to your admin of bot
var options = {
    options: {
        debug: true
    },
    connection: {
        random: 'chat',
        reconnect: true
    },
    identity: {
        username: 'bot-account-name', // change
        password: 'oauth:bot-auth-key' // change, get from twitchapps.com/tmi
    },
    channels: ['#gempir']
};
var client = new irc.client(options);

// Connect the client to the server...

client.connect();


// check if folders exist for channels if not create them

if (!fs.existsSync('logs')){
    fs.mkdirSync('logs');
    console.log('Created folder: logs');
}

options.channels.forEach(function(channel) {
  if (!fs.existsSync('logs/' + channel.substr(1))){
    fs.mkdirSync('logs/' + channel.substr(1));
    console.log('Created folder: ' + channel.substr(1));
  }
});


function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function getNthWord(string, n) {
    var words = string.split(" ");
    return words[n-1];
}

setInterval(function() {
  global.time = 10000000000000000000;
}, 10000);

// check emote count 
client.on('chat', function(channel, user, message, self) {
  if (message.substr(0,8) === '!countme' && global.time > (new Date).getTime()) {
      var emote = message.replace('!countme†','');
      fs.readFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', function (err, data) {
        var emoteCount = occurrences(data, emote);
        client.say(channel, user.username + ', you used ' + 'the phrase' + ' ' + emoteCount + ' times');
        console.log(user.username + ', you used ' + emote + ' ' + emoteCount + ' times');
      });
      global.time = 0;
  }
});


client.on('chat', function(channel, user, message, self) {
  if (message.substr(0,6) === '!count' && global.time > (new Date).getTime()) {
      var searchWord = message.replace('!count','');
      fs.readFile('logs/' + channel.substr(1) + '.txt', function (err, data) {
        var emoteCount = occurrences(data, searchWord);
        client.say(channel, user.username + ', chat used ' + 'the phrase' + ' ' + emoteCount + ' times');
        console.log(user.username + ', chat used ' + 'the phrase' + ' ' + emoteCount + ' times');
      });
      global.time = 0;
  }
});


// status command

client.on('chat', function (channel, user, message, self) {
   if (user["username"] === admin || user["user-type"] === "mod" ) {
     if (message.toLowerCase() === '!status') {
     client.say(channel, 'active in: ' + options.channels);
     }
   }
});

// logs

client.on('chat', function (channel, user, message, self) {   
    fs.appendFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function(){});      
});

client.on('chat', function (channel, user, message, self) {   
    fs.appendFile('logs/' + channel.substr(1) +'.txt', '[GMT+1 ' + moment().utcOffset(60).format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function(){});      
});

client.on('chat', function (channel, user, message, self) {
    if (user.username === admin || user["user-type"] === "broadcaster" || user["user-type"] === "mod") {
      if ( message.substr(0,5) == '!logs') {
        var logsFor = getNthWord(message,2);
        logsFor = logsFor.toLowerCase();
        pastebin.createPasteFromFile('./logs/' + channel.substr(1) + '/' + logsFor + '.txt', 'logs for ' + logsFor,null,2)
          .then(function (data) {
                client.say(channel, '@' + user.username + ', pastebin.com/' + data);
                console.log('Pastebin created: ' + data);
                setTimeout(function(){
            pastebin.deletePaste(data)
            console.log('Pastebin deleted: ' + data)
        }, 300000);
            
            })
          .fail(function (err) {
                client.say(channel, err);
                console.log(err);
          });
      }
    } 
})



