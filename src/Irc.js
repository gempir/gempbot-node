import cfg   from './../../cfg';
import net   from 'net';
import fs    from 'fs';


export default class Irc {

    constructor(bot) {
        this.bot         = bot;
        this.socket      = new net.Socket();
        this.logs        = this.logs = __dirname +'/../../../logs/';

        this.setupConnection();
        this.readConnection();


        this.socket.on('connect', () => {
            this.startUpJoin();
        });
    }

    output(channel, message) {
        message = message.trim();
        this.socket.write('PRIVMSG ' + channel + ' :' + message +'\r\n');
        console.log(channel + ' ' + message);
    }

    setupConnection() {
        this.socket.setEncoding('utf-8');
        this.socket.setNoDelay();
        this.socket.connect(cfg.irc.port, cfg.irc.server);
        console.log('[irc] connected to ' + cfg.irc.server + ':' + cfg.irc.port);
    }

    readConnection() {
        var buffer = new Buffer('');
        this.socket.on('data', (chunk) => {
            if (typeof (chunk) === 'string') {
                buffer += chunk;
            } else {
                buffer = Buffer.concat([buffer, chunk]);
            }
            var lines = buffer.toString().split(/\r\n|\r|\n/);

            if (lines.pop()) {
                return;
            } else {
                buffer = new Buffer('');
            }

            lines.forEach((line) => {
                this.bot.parser.parseData(line);
            })
        });
    }

    startUpJoin() {
        this.socket.write('PASS ' + cfg.irc.pass + '\r\n');
    	this.socket.write('USER ' + cfg.irc.username + '\r\n');
        this.socket.write('NICK ' + cfg.irc.username + '\r\n');
        this.bot.redis.hgetall('channels', (err, results) => {
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

        this.socket.write('JOIN ' + channel + '\r\n');
        console.log('[redis] ' + channel + ' ' + response);
        this.bot.redis.hset('channels', channel, response, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            this.bot.setConfigForChannel(channel);
            this.bot.loadBttvChannelEmotes(channel);
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
        this.bot.redis.hdel('channels', channel, (err) => {
            if (err) console.log(err);
        });
    }

}
