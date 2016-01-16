var admin = 'gempir';

var options = {
        options: {
            debug: false // for normal chat connection
        },
        connection: {
            random: 'chat',
            reconnect: true
        },
        identity: {
            username: 'gempbot',
            password: 'oauth:'
        },
        channels: ['#gempir'] // do not put more than 1 here. This bot is not written for multiple channels
};

var dbOptions = {
  host: "host",
  user: "user",
  password: "pw",
  database: "db"
}

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
          'api_dev_key' : 'key',
          'api_user_name' : 'name',
          'api_user_password' : 'pw'
        });


module.exports =
{
    pastebin,
    admin,
    options,
    dbOptions
};
