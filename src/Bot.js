import cfg          from './../cfg';
import IRC          from './controllers/IRC';
import redis        from './models/redis';
import fn           from './controllers/functions'
import chat         from './controllers/chat';
import emotecache   from './models/emotecache';
import commandcache from './models/commandcache';

import Handler      from './Handler';

// modules
import Logs         from './modules/Logs';
import Combo        from './modules/Combo';
import Nuke         from './modules/Nuke';
import Lines        from './modules/Lines';
import Randomquote  from './modules/Randomquote';
import LastMessage  from './modules/LastMessage';
import Voting       from './modules/Voting';
import Followage    from './modules/Followage';
import Chatters     from './modules/Chatters';
import oddshots     from './modules/oddshots';
import Emotecount   from './modules/Emotecount';



export default class Bot {

    constructor() {
        this.controllers = {
            cfg: cfg,
            chat: chat,
        };
        this.models = {
            emotecache: emotecache,
            commandcache: commandcache,
            redis: redis
        };
        this.modules = {
            logs:        new Logs(this),
            combo:       new Combo(this),
            lines:       new Lines(this),
            randomquote: new Randomquote(this),
            nuke:        new Nuke(this),
            lastmessage: new LastMessage(this),
            voting:      new Voting(this),
            followage:   new Followage(this),
            chatters:    new Chatters(this),
            emotecount:  new Emotecount(this),
            oddshots:    oddshots
        };
        this.channels  = {};
        this.admins    = cfg.admins;
        this.cmdcds    = [];
        this.usercds   = [];

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
                    this.loadChannel(channel, results[channel]);
                    this.setConfigForChannel(channel);
                }
           }
       });
    }

    loadChannel(channel, response) {
        this.modules.logs.createFolder(channel);
        this.channels[channel] = {};
        this.channels[channel]['config'] = {};
        this.channels[channel].config['response'] = response;
        this.setConfigForChannel(channel);
    }

    setConfigForChannel(channel) {
        redis.hgetall(channel + ':config', (err, results) => {
            for (var cfg in results) {
                this.channels[channel].config[cfg] = results[cfg];
            }
        });
    }

    loadCache() {
        this.models.commandcache.cacheCommands();
        this.models.emotecache.fetchEmotesFromBttv();
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
