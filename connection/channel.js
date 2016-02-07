var cfg = require('./../cfg.js');
var irc = require('tmi.js');
var client = new irc.client(cfg.options);


module.exports =
{
	client
}
