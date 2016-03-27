
import fn from './functions';

export default class CommandHandler {
    constructor(bot) {
        this.bot = bot;
    }


    handle(channel, user, command, args) {
        console.log(command, args);

        if (this.bot.admins.indexOf(user.username) > -1) {
            this.handleNormal(channel, user, command, args);
            this.handleAdmin(channel, user, command, args);
            this.handleBroadcaster(channel, user, command, args);
            return;
        }

        if (user.username === channel.substr(1)) {
            this.handleNormal(channel, user, command, args);
            this.handleBroadcaster(channel, user, command, args);
            return;
        }

        this.handleNormal(channel, user, command, args);
    }


    handleNormal(channel, user, command, args) {
        this.bot.controllers.redis.hget(channel + ':levels', user.username, (err, results) => {
            if (err) {
                console.log(err)
                return;
            }
            var level = results || 100;

            if (level >= 500) {
                if (command === '!cmd' || command === '!command') {
                    try {
                        switch (args[0]) {
                            case 'add':
                                args.splice(0,1);
                                this.addCommand(channel, user, args);
                                return;
                            case 'del':
                            case 'rm':
                            case 'delete':
                            case 'remove':
                                if (args[1].indexOf('!') === -1) args[1] = '!' + args[1];
                                this.bot.controllers.redis.hdel(channel + ":commands", args[1]);
                                this.bot.whisper(user.username, 'removed command ' + args[1]);
                                return;
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }

            this.bot.controllers.redis.hget(channel + ':commands', command, (err, results) => {
                if (err || results === null) {
                    console.log('[command] ', err, results);
                    return;
                }
                var commObj = JSON.parse(results);

                if (level < commObj.level) {
                    return; // level too low
                }

                switch (commObj.func) {
                    case 'voting':
                        this.bot.modules.voting.startVoting(channel, user.username, args[0]);
                        break;
                    case null:
                    default:
                        // message commands
                        break;

                }
            });

        });
    }

    addCommand(channel, user, args) {
        var name        = args[0];
        args.splice(0,1);
        var message     = '';
        var func        = null;
        var cd          = 5;
        var description = '';
        var response    = false;

        if (name.indexOf('!') === -1) {
            name = '!' + name;
        }

        for (var i = 0; i < args.length; i++) {
            if (args[i].indexOf('--response') > -1) {
                response = true;
            } else if (args[i].indexOf('--cd-') > -1) {
                cd = args[i].replace('--cd-', '');
            } else if (args[i].indexOf('--func-') > -1) {
                func = args[i].replace('--func-', '');
            } else {
                message += args[i] + ' ';
            }
        }

        var commObj = {
            name: name,
            message: message,
            cd: cd,
            func: func,
            response: response,
            description: description
        }
        console.log("set", commObj.name, commObj);
        this.bot.controllers.redis.hset(channel + ':commands', commObj.name, JSON.stringify(commObj));
        this.bot.whisper(user.username, 'command ' + commObj.name + ' set');
    }

    handleBroadcaster(channel, user, command, args) {
        switch (command) {
            case '!lvl':
            case '!level':
                try {
                    this.bot.controllers.redis.hset(channel + ':levels', args[0], args[1]);
                    this.bot.whisper(user.username, args[0] + ' level set to ' + args[1]);
                } catch (err) {
                    console.log(err)
                }
                break;
            case '!cfg':
            case '!config':
                try {
                    this.bot.controllers.redis.hset(channel + ':config', args[0], args[1]);
                    this.bot.whisper(user.username, 'config ' + args[0] + ' set to ' + args[1]);
                } catch(err) {
                    console.log(err);
                }
                break;
            case '!trust':
            case '!trusted':
                try {
                    switch (args[0]) {
                        case 'add':
                            this.bot.controllers.redis.hset(channel + ':trusted', args[1], '1');
                            this.bot.whisper(user.username, 'added ' + args[1] + ' to trusted');
                            break;
                        case 'rm':
                        case 'remove':
                            this.bot.controllers.redis.hset(channel + ':trusted', args[1], '0');
                            this.bot.whisper(user.username, 'removed ' + args[1] + ' from trusted');
                            break;
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
        }
    }

    handleAdmin(channel, user, command, args) {
        switch (command) {
            case '!status':
                var time = process.uptime();
                var uptime = fn.secsToTime((time + ""));
                this.bot.say(
                    channel,
                    '@' + user.username + ', uptime: ' + uptime
                    + ' | active in ' + fn.countProperties(this.bot.channels) + ' channels'
                );
                break;
            case '!join':
                this.bot.IRC.joinChannel(args);
                break;
            case '!part':
                this.bot.IRC.partChannel(args);
                break;
            case '!say':
                var toSay = message.substr(5);
                this.bot.say(channel, toSay);
                break;
        }
    }

}
