setInterval(function() {
  global.cooldown = false;
}, 5000);

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
          'api_dev_key' : '',
          'api_user_name' : '',
          'api_user_password' : ''
        });
var admin = 'gempir';
var options = {
        options: {
            debug: true
        },
        connection: {
            random: 'chat',
            reconnect: true
        },
        identity: {
            username: 'gempbot',
            password: 'oauth:'
        },
        channels: ['#gempir']
};

module.exports = { pastebin, admin, options};