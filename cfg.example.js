setInterval(function() {
  global.cooldown = false;
}, 5000); 

var admin = 'gempir';

var db = {
    host: 'localhost',
    user: 'YOURUSER',
    password: 'YOURPASSWORD',
    database: 'gempir'
}

var options = {
        options: {
            debug: true
        },
        connection: {
            random: 'chat',
            reconnect: true
        },
        identity: {
            username: 'YOURBOTNAME',
            password: 'oauth:YOURTOKEN'
        },
        channels: ['#gempir']
};

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
          'api_dev_key' : 'YOURDEVKEY',
          'api_user_name' : 'YOURUSERNAME',
          'api_user_password' : 'YOURPASSWORD'
        });


module.exports = 
{ 
    pastebin,
    admin,
    options,
    db
};