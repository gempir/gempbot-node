var admins = ['gempir'];

var irc = {
    server: "irc.chat.twitch.tv",
    port: 80,
    username: "",
    pass: 'test;oauth:'
} // missing the group connection, because for me my relaybroker handles that together

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
    admins,
    irc,
    redis,
    pastebin
};
