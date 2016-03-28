import cfg          from './../cfg';
import Irc          from './controllers/Irc';
import redis        from './models/redis';
import fn           from './controllers/functions'
import request      from 'request';

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
        };
        this.models = {
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
        this.bttv      = {
            channels: {},
            global: []
        }

        this.handler  = new Handler(this);
        this.Irc      = new Irc(this.handler);
        this.loadChannels();
        this.loadBttvEmotes();
    }

    loadChannels() {
        console.log('[redis|API] caching configs and loading emotes');
        redis.hgetall('channels', (err, results) =>  {
           if (err) {
               console.log('[REDIS] ' + err);
           } else {
                for (var channel in results) {
                    this.loadChannel(channel, results[channel]);
                    this.setConfigForChannel(channel);
                    this.loadBttvChannelEmotes(channel);
                }
           }
       });
    }

    loadBttvEmotes() {
        console.log('[API] fetching bttv global emotes');
        request('https://api.betterttv.net/2/emotes', (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var bttvObj = JSON.parse(body);
                var emotes  = bttvObj.emotes;
                for (var i = 0; i < emotes.length; i++) {
                    this.models.redis.hset('bttvemotes', emotes[i].code, emotes[i].id);
                    this.bttv.global.push(emotes[i].code);
                }
            }
        })
    }

    loadBttvChannelEmotes(channel) {
        this.bttv.channels[channel] = [];
        request('https://api.betterttv.net/2/channels/' + channel.substr(1), (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var bttvObj = JSON.parse(body);
                var emotes  = bttvObj.emotes;
                for (var j = 0; j < emotes.length; j++) {
                    this.models.redis.hset(channel + ':bttvchannelemotes', emotes[j].code, emotes[j].id);
                    this.bttv.channels[channel].push(emotes[j].code);
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

    whisper(username, message) {
        this.Irc.output('#jtv', '/w ' + username + ' ' + message);
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
        this.Irc.output(channel, message);
    }
}
