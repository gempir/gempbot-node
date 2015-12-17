setInterval(function() {
  global.cooldown = false;
}, 7000); 

setInterval(function() {
  global.whisperCooldown = false;
}, 50); 

var admin = 'gempir';
var trusted = ['gempir','gempbot'];

var options = {
        options: {
            debug: false // for normal chat connection
        },
        connection: {
            random: 'chat',
            reconnect: true
        },
        identity: {
            username: 'NAME',
            password: 'oauth:KEY'
        },
        channels: ['#gempir'] // do not put more than 1 here. This bot is not written for multiple channels
};

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
          'api_dev_key' : 'KEY',
          'api_user_name' : 'NAME',
          'api_user_password' : 'PW'
        });


module.exports = 
{ 
    pastebin,
    admin,
    options,
    trusted
};