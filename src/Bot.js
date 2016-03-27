import cfg from './../cfg';
import IRC from './controllers/IRC';
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
            chat: chat,
            config: config,
            redis: redis
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
        this.channels = {};
        this.admins   = cfg.admins;

        this.handler  = new Handler(this);
        this.IRC      = new IRC(this.handler);
        this.loadChannels();
        this.loadCache();
    }

    loadChannels() {
        console.log('[redis] caching configs');
        redis.hgetall('channels', (err, results) =>  {
           if (err) {
               console.log('[REDIS] ' + err);
           } else {
                for (var channel in results) {

                    this.channels[channel] = {};
                    this.channels[channel]['response'] = results[channel];


                    logs.createFolder(channel);
                    this.setConfigForChannel(channel);
                }
           }
       });
    }

    loadChannel(channel, response) {
        this.channels[channel] = {};
        this.channels[channel]['response'] = response;
        logs.createFolder(channel);
        this.setConfigForChannel(channel);
    }


    setConfigForChannel(channel) {
        redis.hgetall(channel + ':config', (err, results) => {
            this.channels[channel]['config'] = results || {};
        });
    }

    loadCache() {
        this.models.commandcache.cacheCommands();
        this.models.emotecache.fetchEmotesFromBttv();
        this.controllers.config.cacheConfig();
    }

    whisper(username, message) {
        this.IRC.output('#jtv', '/w ' + username + ' ' + message);
    }

    say(channel, message) {
        try {
            var response = this.channels[channel].config.response;
        } catch (err) {
            console.log(err);
            var response = 0;
        }
        if (response == 0) {
            return;
        }
        this.IRC.output(channel, message);
    }
}
