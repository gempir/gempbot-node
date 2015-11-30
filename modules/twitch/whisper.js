var irc = require('tmi.js'); 
var cfg = require('./../../cfg');

var client = new irc.client({
    identity: {
        username: cfg.options.username,
		password: cfg.options.password
    }
});

client.connect();

module.exports = 
{
	client
}