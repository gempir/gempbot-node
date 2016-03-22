import irc from './controllers/irc';
import config from './controllers/config';
import chat from './controllers/chat';
import emotecache from './models/emotecache';
import commandcache from './models/commandcache';

export default class Bot {

    construct() {
        commandcache.cacheCommands();
        emotecache.fetchEmotesFromBttv(function() {
            emotecache.cacheEmotes();
        });
        config.cacheConfig();
    }

    say(channel, message, action) {
        action = action || false;
        irc.say(channel, message, action);
    }

    whisper(username, message) {
        irc.whisper(username, message);
    }
}
