var cfg    = require('./../../cfg');
var net    = require('net');
var redis  = require('./../models/redis');
var events = require('events');
var fn     = require('./functions');
var fs     = require('fs');
var parse = require('irc-message').parse

import Parser from "./Parser";



export default class IRC {

    constructor(handler) {
        this.bot         = handler.bot;
        this.socket      = new net.Socket();
        this.parser      = new Parser(handler);

        this.setupConnection();
        this.readConnection();

        this.socket.on('connect', () => {
            this.startUpJoin();
        });
    }

    output(channel, message) {
        message = message.trim();
        this.socket.write('PRIVMSG ' + channel + ' :' + message +'\r\n');
        console.log(channel + ' => ' + message);
    }

    setupConnection() {
        this.socket.setEncoding('utf-8');
        this.socket.setNoDelay();
        this.socket.connect(cfg.irc.port, cfg.irc.server);
        console.log('[irc] connected to ' + cfg.irc.server + ':' + cfg.irc.port);
    }

    readConnection() {
        this.socket.on('data', (data) => {
            this.parser.parse(data);
        });
    }

    startUpJoin() {
        this.socket.write('PASS ' + cfg.irc.pass + '\r\n');
    	this.socket.write('USER ' + cfg.irc.username + '\r\n');
        this.socket.write('NICK ' + cfg.irc.username + '\r\n');
        redis.hgetall('channels', (err, results) => {
           if (err) {
               console.log('[REDIS] ' + err);
           } else {
                for (var channel in results) {
                  if (results.hasOwnProperty(channel)) {
                    this.socket.write('JOIN ' + channel + '\r\n');
                    console.log('JOIN ' + channel);
                    this.bot.channels[channel]['response'] = results[channel];
                  }
                }
           }
       });
    }


    joinChannel(args) {
        if (args.length < 1) {
            return;
        }
        var channel  = args[0];
        if (channel.indexOf("#") === -1) {
            return;
        }
        var response = 1;
        if (args.length > 1) {
            if (args[1].toLowerCase() === 'silent') {
                response = 0;
            }
        }

        if (!fs.existsSync('logs/' + channel.substr(1))){
          fs.mkdirSync('logs/' + channel.substr(1));
          console.log('[LOG] created folder: ' + channel.substr(1));
        }

        this.socket.write('JOIN ' + channel + '\r\n');
        console.log('[redis] ' + channel + ' ' + response);
        redis.hset('channels', channel, response, (err) => {
            if (err) console.log(err);
            this.bot.loadChannel(channel, response);
        });
    }


    partChannel(args) {
        if (args.length < 1) {
            return;
        }
        var channel  = args[0];

        this.socket.write('PART ' + channel + '\r\n');
        console.log('[redis] PART ' + channel)
        redis.hdel('channels', channel, (err) => {
            if (err) console.log(err);
        });
    }

}
