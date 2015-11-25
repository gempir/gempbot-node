var twitch = require('./twitch');
var fn = require('./functions');

client = twitch.client;

var lastMessage = '';
var currentMessage = '';
var counter = 1;

client.on('chat', function(channel, user, message, self) {
    var currentMessage = message;

    if (currentMessage != lastMessage) {
    	if ( counter > 2 && global.cooldown === false) {
            

            if (fn.stringIsLongerThan(lastMessage, 30)) {
                var combo = fn.getNthWord(lastMessage, 1) + ' ...';
            }
            else {
                var combo = lastMessage;
            }
            if (fn.stringContainsUrl(combo)) {
                combo = '...'
            }

    		client.action(channel, counter + 'x ' + combo + ' COMBO');
            global.cooldown = true;
    	}
    	counter = 1;
    }
    if (currentMessage.toLowerCase() === lastMessage.toLowerCase()) {
    	counter++;
    }
    lastMessage = message; 
});