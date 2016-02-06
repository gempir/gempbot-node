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

var redis = {
    port: '6379',
    host: '127.0.0.1',
    family: 4,
    db: 0,
    password: ''
}

var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
          'api_dev_key' : '',
          'api_user_name' : '',
          'api_user_password' : ''
    });


module.exports =
{
    pastebin,
    admin,
    options,
    redis
};
