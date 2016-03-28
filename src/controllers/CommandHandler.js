import fn from './functions';

export default class CommandHandler {
    constructor(bot) {
        this.bot = bot;
    }


    handle(channel, user, command, args) {
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
        this.handleDefault(channel, user, command, args);

        this.bot.models.redis.hget(channel + ':levels', user.username, (err, results) => {
            if (err) {
                console.log(err)
                return;
            }
            var level = results || 100;
            if (user.username === channel.substr(1)) {
                level = 2000;
            }

            if (level >= 500 || this.bot.admins.indexOf(user.username) > -1 || user.username === channel.substr(1)) {
                switch (command) {
                    case '!cmd':
                    case '!command':
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
                                    this.bot.models.redis.hdel(channel + ":commands", args[1]);
                                    this.bot.whisper(user.username, 'removed command ' + args[1]);
                                    return;
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        break;
                    case '!cache':
                        this.bot.loadChannels();
                        this.bot.loadBttvEmotes();
                        break;
                }
            }

            this.bot.models.redis.hget(channel + ':commands', command, (err, results) => {
                if (err || results === null) {
                    return;
                }
                var commObj = JSON.parse(results);

                if (level < commObj.level || this.bot.cmdcds.indexOf(commObj.name) > -1 || this.bot.usercds.indexOf(user.username) > -1) {
                    return; // level too low
                }

                this.bot.cmdcds.push(commObj.name);
                setTimeout(() => {
                    fn.removeFromArray(this.bot.cmdcds, commObj.name);
                }, commObj.cd * 1000)

                this.bot.usercds.push(user.username);
                setTimeout(() => {
                    fn.removeFromArray(this.bot.usercds, user.username);
                }, 3000)

                try {
                    var prefix = '';
                    if (commObj.response) {
                        prefix = user.username + ', ';
                    }
                    if (commObj.func != null) {
                        commObj.func.toLowerCase();
                    }
                    switch (commObj.func) {
                        case 'voting':
                            this.bot.modules.voting.startVoting(channel, user.username, args[0], prefix);
                            break;
                        case 'chatters':
                            this.bot.modules.chatters.getChatters(channel, prefix);
                            break;
                        case 'count':
                            this.bot.modules.emotecount.count(channel, user.username, args[0], prefix);
                            break;
                        case 'countme':
                            this.bot.modules.emotecount.countMe(channel, user.username, args[0], prefix);
                            break;
                        case 'follow':
                        case 'followage':
                            this.bot.modules.followage.followageCommandHandler(channel, user.username, args, prefix);
                            break;
                        case 'lastmessage':
                            this.bot.modules.lastmessage.lastMessage(channel, user.username, args[0], prefix);
                            break;
                        case 'lines':
                            this.bot.modules.lines.lineCount(channel, user.username, args, prefix);
                            break;
                        case 'logs':
                            this.bot.modules.logs.uploadLogs(channel, user.username, args, prefix);
                            break;
                        case 'nuke':
                            this.bot.modules.nuke.nuke(channel, user.username);
                            break;
                        case 'quote':
                        case 'rquote':
                        case 'rndquote':
                        case 'randomquote':
                            this.bot.modules.randomquote.getQuote(channel, user.username, args, prefix);
                            break;
                        case null:
                        default:
                            this.bot.say(channel, prefix + commObj.message);
                            break;

                    }
                } catch (err) {
                    console.log(err);
                }
            });

        });
    }

    handleDefault(channel, user, command, args) {
        try {
            switch (command) {
                case '!v':
                case '!vt':
                case '!vote':
                    this.bot.modules.voting.vote(channel, user.username, args[0]);
                    break;
                case '!skip':
                    this.bot.modules.voting.vote(channel, user.username, 'skip');
                    break;
                case '!stay':
                    this.bot.modules.voting.vote(channel, user.username, 'stay');
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    }

    addCommand(channel, user, args) {
        var name        = args[0];
        args.splice(0,1);
        var message     = '';
        var func        = null;
        var cd          = 5;
        var description = '';
        var response    = false;
        var level       = 100;

        if (!(name.indexOf('!') > -1)) {
            name = '!' + name;
        }

        for (var i = 0; i < args.length; i++) {
            if (args[i].indexOf('--response') > -1) {
                response = true;
            } else if (args[i].indexOf('--cd-') > -1) {
                cd = args[i].replace('--cd-', '');
            } else if (args[i].indexOf('--func-') > -1) {
                func = args[i].replace('--func-', '');
            } else if (args[i].indexOf('--level-') > -1) {
                level = args[i].replace('--level-', '');
            } else if (args[i].indexOf('--lvl-') > -1) {
                level = args[i].replace('--lvl-', '');
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
            level: level,
            description: description
        }
        console.log("set", commObj.name, commObj);
        this.bot.models.redis.hset(channel + ':commands', commObj.name, JSON.stringify(commObj));
        this.bot.whisper(user.username, 'command ' + commObj.name + ' set');
    }

    handleBroadcaster(channel, user, command, args) {
        switch (command) {
            case '!lvl':
            case '!level':
                try {
                    this.bot.models.redis.hset(channel + ':levels', args[0], args[1]);
                    this.bot.whisper(user.username, args[0] + ' level set to ' + args[1]);
                } catch (err) {
                    console.log(err)
                }
                break;
            case '!cfg':
            case '!config':
                try {
                    this.bot.models.redis.hset(channel + ':config', args[0], args[1]);
                    this.bot.whisper(user.username, 'config ' + args[0] + ' set to ' + args[1]);
                    this.bot.setConfigForChannel(channel);
                } catch(err) {
                    console.log(err);
                }
                break;
            case '!trust':
            case '!trusted':
                try {
                    switch (args[0]) {
                        case 'add':
                            this.bot.models.redis.hset(channel + ':trusted', args[1], '1');
                            this.bot.whisper(user.username, 'added ' + args[1] + ' to trusted');
                            break;
                        case 'rm':
                        case 'remove':
                            this.bot.models.redis.hset(channel + ':trusted', args[1], '0');
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
                console.log(this.bot.bttv.channels[channel]);
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
