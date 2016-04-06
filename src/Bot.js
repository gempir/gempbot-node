import request      from 'request';

import cfg          from './../cfg';

import redis        from './redis';
import mysql        from './mysql';

import Irc          from './Irc';
import Database     from './Database';
import Filters      from './Filters';
import Parser       from './Parser';
import Handler      from './Handler';
import Timeout      from './Timeout';
import Eventhub     from './Eventhub';

// modules
import Logs         from './modules/Logs';
import Combo        from './modules/Combo';
import Nuke         from './modules/Nuke';
import Lines        from './modules/Lines';
import Voting       from './modules/Voting';
import Followage    from './modules/Followage';
import Chatters     from './modules/Chatters';
import Oddshots     from './modules/Oddshots';
import Emotecount   from './modules/Emotecount';
import Facts        from './modules/Facts';



export default class Bot {

    constructor() {
        this.cfg      = cfg;
        this.admins   = cfg.admins;
        this.name     = cfg.irc.username;
        this.redis    = redis;
        this.mysql    = mysql;
        this.irc      = new Irc(this);
        this.parser   = new Parser(this);
        this.handler  = new Handler(this);
        this.filters  = new Filters(this);
        this.timeout  = new Timeout(this);
        this.eventhub = new Eventhub(this);
        this.db       = new Database(this);
        this.modules  = {
            logs:        new Logs(this),
            combo:       new Combo(this),
            lines:       new Lines(this),
            nuke:        new Nuke(this),
            voting:      new Voting(this),
            followage:   new Followage(this),
            chatters:    new Chatters(this),
            emotecount:  new Emotecount(this),
            oddshots:    new Oddshots(this),
            facts:       new Facts(this)
        };
        this.channels  = {};
        this.intervals = {};
        this.cmdcds    = [];
        this.usercds   = [];
        this.bttv      = {
            channels: {},
            global: []
        };
        this.configs   = [
            'filterlinks',
            'filterlength',
            'filterascii',
            'combos',
            'facts'
        ];
        this.loadChannels();
        this.loadBttvEmotes();
    }

    loadChannels() {
        console.log('[redis|API] caching configs and loading emotes');
        this.redis.hgetall('channels', (err, results) =>  {
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
                    this.bttv.channels[channel].push(emotes[j].code);
                }
            }
        });

    }

    loadChannel(channel, response) {
        this.channels[channel] = {};
        this.channels[channel]['config'] = {};
        this.channels[channel].config['response'] = response;
        this.setConfigForChannel(channel);
    }

    setConfigForChannel(channel) {
        redis.hgetall(channel + ':config', (err, results) => {
            for (var cfg in results) {
                this.channels[channel].config[cfg.toLowerCase()] = results[cfg].toLowerCase();
            }
            this.setTimedOutputs(channel);
        });
    }

    setTimedOutputs(channel) {
        if (typeof this.intervals[channel] == 'undefined') {
            this.intervals[channel] = {};
        }
        if (typeof this.channels[channel].config.facts == 'undefined' || this.channels[channel].config.facts == null) {
            try {
                clearInterval(this.intervals[channel]['facts']);
            } catch (err) {};
            return;
        }
        try {
            var factsConf = this.channels[channel].config.facts;
            if (factsConf != null || factsConf != false || factsConf != 0 || factsConf > 10) {
                try {
                    clearInterval(this.intervals[channel]['facts']);
                } catch (err) {};
                this.intervals[channel]['facts'] = setInterval(() => {
                    this.modules.facts.sayFact(channel);
                }, factsConf * 1000);
            }
        } catch (err) {
        }

    }

    whisper(username, message) {
        this.irc.output('#jtv', '/w ' + username + ' ' + message);
    }

    say(channel, message)
    {
        try {
            var response = this.channels[channel].config.response;
        } catch (err) {
            console.log(err);
            var response = 0;
        }
        if (response == 0) {
            return;
        }
        this.irc.output(channel, message);
    }

    getConfig(channel, configName)
    {
        configName = configName.toLowerCase();
        var conf   = this.channels[channel].config[configName];
        if (typeof conf == 'undefined') {
            return null;
        }
        return conf;
    }
}
