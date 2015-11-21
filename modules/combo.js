var twitch = require('./twitch');
var fn = require('./functions');

client = twitch.client;

var lastMessage = null;
var currentMessage = null;
var counter = 1;

client.on('chat', function(channel, user, message, self) {
    var currentMessage = message;


    if (currentMessage != lastMessage && counter > 2 && global.cooldown === false) {
    	client.action(channel, counter + 'x ' + lastMessage + ' COMBO');
    	counter = 1;
    	global.cooldown = true;
    }
    if (currentMessage === lastMessage) {
    	counter++;
    }
    lastMessage = message;
});