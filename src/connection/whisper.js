var cfg = require('./../../cfg');
var irc = require('tmi.js');

var group = new irc.client({
        options: {
            debug: false
        },
        connection: {
            server: "group.tmi.twitch.tv",
            port: 80,
            reconnect: true
        },
        identity: {
            username: cfg.options.identity.username,
            password: cfg.options.identity.password
        },
});

group.connect();

module.exports =
{
    group
}
