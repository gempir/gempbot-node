var cfg = require('./../../cfg');

var settings = {
    server : "192.16.64.180",
    port: 443,
    secure: false,
    nick : cfg.options.identity.username,
    password : cfg.options.identity.password 
}

var irc = require("irc");

var group = new irc.Client(settings.server, settings.nick, {
    debug: false,
    password: settings.password,
    username: settings.nick
});

group.connect(function() {
    console.log("Connected!");
});

module.exports = 
{
    group
}