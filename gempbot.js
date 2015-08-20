// admins for your bot

var admins = ['gempir'];

var irc = require('tmi.js'); 
var moment = require('moment');
fs = require('fs');
var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
      'api_dev_key' : 'pastebindevkey',
      'api_user_name' : 'pastebinaccountname',
      'api_user_password' : 'pastebinpassword'
    });

var options = {
    options: {
        debug: true
    },
    connection: {
        random: 'chat',
        reconnect: true
    },
    identity: {
        username: 'botaccountname',
        password: 'oauth:twitchauthkey'
    },
    channels: ['#gempir']
};
var client = new irc.client(options);

// Connect the client to the server...

client.connect();

// variables

var activein = options.channels.toString();

// status command

client.on('chat', function (channel, user, message, self) {
   if (user["username"] === admins[0] || user["user-type"] === "mod" ) {
     if (message.toLowerCase() === '!status') {
     client.say(channel, 'Active in: ' + activein);
     }
   }
});

// sub notifications

client.on("subscription", function (channel, user) {
  client.say(channel, '/me | ' + username + ' just subscribed!');
});

client.on("subanniversary", function (channel, user, months) {
    client.say(channel, '/me | ' + username + ' just re-subscribed for ' + months + ' months');
});

// logs

client.on('chat', function (channel, user, message, self) {
  fs.open('logs/' + channel.substr(1) + '/' + user.username +'.txt','r',function(err,fd){
    if (err && err.code=='ENOENT') 
    {
    fs.writeFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', '[' + 'GMT' + moment().format('Z ') + moment().format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function (err) {});
    } else {
    fs.appendFile('logs/' + channel.substr(1) + '/' + user.username +'.txt', '[' + 'GMT' + moment().format('Z ') + moment().format('D.M.YYYY H:mm:ss')  + '] ' + user.username + ': ' + message + '\n', function(){});    
    }
  });
  
});

client.on('chat', function (channel, user, message, self) {
    if (user.username === admins[0] || user.username === admins[1] || user["user-type"] === "mod" ) {
      if ( message.indexOf("!logs") >= 0 ) {
        var getNthWord = function(string, n){
          var words = string.split(" ");
          return words[n-1];
        }

        pastebin.createPasteFromFile('./logs/' + channel.substr(1) + '/' + getNthWord(message, 2) + '.txt', 'logs for ' + getNthWord(message, 2),null,2)
          .then(function (data) {
                console.log('Pastebin created: ' + data);
                client.say(channel, '@' + user.username + ', pastebin com/' + data);
            })
          .fail(function (err) {
                console.log(err);
                client.say(channel, err);
          });
      }
    }
});

