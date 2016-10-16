import request      from 'request';

import cfg          from './../cfg';

import redis        from './redis';

import Irc          from './Irc';
import Filters      from './Filters';
import Parser       from './Parser';
import Handler      from './Handler';
import Eventhub     from './Eventhub';
import overlay      from './overlay/overlay';

// modules
import Logs           from './modules/Logs';
import Combo          from './modules/Combo';
import Nuke           from './modules/Nuke';
import Lines          from './modules/Lines';
import Voting         from './modules/Voting';
import Followage      from './modules/Followage';
import Oddshots       from './modules/Oddshots';
import OverwatchStats from './modules/OverwatchStats';


export default class Bot {

    constructor() {
        this.cfg      = cfg;
        this.admins   = cfg.admins;
        this.name     = cfg.irc.username;
        this.redis    = redis;
        this.overlay  = overlay;
        this.irc      = new Irc(this);
        this.parser   = new Parser(this);
        this.handler  = new Handler(this);
        this.filters  = new Filters(this);
        this.eventhub = new Eventhub(this);
        this.modules  = {
            logs:           new Logs(this),
            combo:          new Combo(this),
            lines:          new Lines(this),
            nuke:           new Nuke(this),
            voting:         new Voting(this),
            followage:      new Followage(this),
            oddshots:       new Oddshots(this),
            overwatchstats: new OverwatchStats(this),
        };
        this.channels  = {};
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
            'btag'
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
            } else {
                console.log('[bttv]', response.statusCode, error);
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
            } else {
                console.log('[bttv]', channel, response.statusCode, error);
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
        });
    }

    whisper(username, message) {
        this.irc.output('#jtv', `/w ${username} ${message}`);
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
        this.overlay.emit("botmessage", { channel: channel, message: message });
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
