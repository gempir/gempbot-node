import cfg from './../cfg';
import irc from './controllers/irc';
import config from './controllers/config';
import redis from './models/redis';
import fn from './controllers/functions'
import chat from './controllers/chat';
import emotecache from './models/emotecache';
import commandcache from './models/commandcache';

import Handler from './Handler';

// modules
import logs from './modules/logs';
import combo from './modules/combo';
import count from './modules/count';
import nuke  from './modules/nuke';
import lines from './modules/lines'; // should be in logs in the future
import quote from './modules/quote'; // should be in logs in the future
import lastmessage from './modules/lastmessage'; // should be in logs in the future
import voting from './modules/voting';
import followage from './modules/followage';
import chatters from './modules/chatters';
import oddshots from './modules/oddshots';
import emotelog from './modules/emotelog';



export default class Bot {

    constructor() {
        this.controllers = {
            cfg: cfg,
            irc: irc,
            chat: chat,
            config: config
        };
        this.models = {
            emotecache: emotecache,
            commandcache: commandcache
        };
        this.modules = {
            logs: logs,
            combo: combo,
            count: count,
            lines: lines,
            quote: quote,
            nuke: nuke,
            lastmessage: lastmessage,
            voting: voting,
            followage: followage,
            chatters: chatters,
            oddshots: oddshots,
            emotelog: emotelog
        };
        this.handler = new Handler(this.controllers, this.models, this.modules);
        this.loadCache();
        this.readIRC();
    }

    readIRC() {
        this.controllers.irc.event.on('message', (channel, user, message) => this.handler.handleMessage(channel, user, message));
    }


    loadCache() {
        this.models.commandcache.cacheCommands();
        this.models.emotecache.fetchEmotesFromBttv();
        this.controllers.config.cacheConfig();
    }


    say(channel, message, action) {
        action = action || false;
        irc.say(channel, message, action);
    }

    whisper(username, message) {
        irc.whisper(username, message);
    }


}
