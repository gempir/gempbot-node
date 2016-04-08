import lib from './lib';

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
        this.bot.redis.hget(channel + ':levels', user.username, (err, results) => {
            if (err) {
                console.log(err)
                return;
            }
            var level = results || 100;
            if (user.username === channel.substr(1)) {
                level = 2000;
            }
            if (level >= 500 || this.bot.admins.indexOf(user.username) > -1 || user.username === channel.substr(1)) {
                this.handleTrusted(channel, user, command, args);
            }
            this.handleCommand(channel, user, command, args, level);
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

    handleTrusted(channel, user, command, args)
    {
        switch (command) {
            case '!cmd':
            case '!command':
                try {
                    switch (args[0]) {
                        case 'add':
                            args.splice(0,1);
                            this.addOrEditCommand(channel, user, args, false);
                            return;
                        case 'edit':
                            args.splice(0,1);
                            this.addOrEditCommand(channel, user, args, true);
                            return;
                        case 'del':
                        case 'rm':
                        case 'delete':
                        case 'remove':
                            if (args[1].indexOf('!') === -1) args[1] = '!' + args[1];
                            this.bot.redis.hexists(channel + ':commands', args[1], (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!results) {
                                    this.bot.whisper(user.username, 'command ' + args[1] + ' not found');
                                    return;
                                }
                                this.bot.redis.hdel(channel + ":commands", args[1]);
                                this.bot.whisper(user.username, 'removed command ' + args[1]);
                            });
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
            case '!fact':
                try {
                    switch(args[0]) {
                        case 'add':
                            args.splice(0,1);
                            this.bot.modules.facts.addFact(channel, user.username, args.join(' ').trim());
                            break;
                        case 'rm':
                        case 'remove':
                            args.splice(0,1);
                            this.bot.modules.facts.removeFact(channel, user.username, args.join(' ').trim());
                            break;
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            case "!bp":
            case '!banphrase':
                try {
                    var action = args[0];
                    args.splice(0,1);
                    var banphrase = args.join(' ').toLowerCase();
                    console.log(action)
                    switch(action) {
                        case 'add':
                            this.bot.redis.hset(channel + ':banphrases', banphrase, 1, (err) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                this.bot.loadBanphrases(channel);
                                this.bot.whisper(user.username, 'added banphrase ' + banphrase);
                            });
                            break;
                        case 'rm':
                        case 'remove':
                            this.bot.redis.hdel(channel + ':banphrases', banphrase, (err, deleted) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!deleted) {
                                    this.bot.whisper(user.username, 'couldn\'t find banphrase ' + banphrase);
                                } else {
                                    this.bot.loadBanphrases(channel);
                                    this.bot.whisper(user.username, 'removed banphrase ' + banphrase);
                                }
                            });
                            break;
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
        }
    }


    handleCommand(channel, user, command, args, level)
    {
        this.bot.redis.hget(channel + ':commands', command, (err, results) => {
            if (err || results === null) {
                return;
            }
            var commObj = JSON.parse(results);

            if (level < commObj.level || this.bot.cmdcds.indexOf(commObj.name) > -1 || this.bot.usercds.indexOf(user.username) > -1) {
                if (this.bot.admins.indexOf(user.username) > -1 || user.username === channel.substr(1)) {
                    // continue
                }
                else {
                    return; // level too low
                }
            }

            this.bot.cmdcds.push(commObj.name);
            setTimeout(() => {
                lib.removeFromArray(this.bot.cmdcds, commObj.name);
            }, commObj.cd * 1000)

            this.bot.usercds.push(user.username);
            setTimeout(() => {
                lib.removeFromArray(this.bot.usercds, user.username);
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
                        var lastMessageUser = args[0] || username;
                        this.bot.modules.logs.getLastMessage(channel, lastMessageUser);
                        break;
                    case 'lines':
                        this.bot.modules.lines.lineCount(channel, user.username, args, prefix);
                        break;
                    case 'logs':
                        var userFor = args[0] || username;
                        this.bot.modules.logs.getLogs(channel, user.username, userFor, prefix);
                        break;
                    case 'alllogs':
                    case 'logsall':
                        var userFor = args[0] || username;
                        this.bot.modules.logs.getLogsAll(user.username, userFor, prefix);
                        break;
                    case 'nuke':
                        this.bot.modules.nuke.nuke(channel, user.username);
                        break;
                    case 'oddshot':
                    case 'oddshots':
                        this.bot.modules.oddshots.getOddshots(channel, user.username, prefix);
                        break;
                    case 'rq':
                    case 'quote':
                    case 'rquote':
                    case 'rndquote':
                    case 'randomquote':
                        if (args.length == 0) {
                            this.bot.modules.logs.getRandomquote(channel, prefix);
                        } else {
                            this.bot.modules.logs.getRandomquoteForUsername(channel, args[0], prefix);
                        }
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
    }


    addOrEditCommand(channel, user, args, edit) {
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

        this.bot.redis.hexists(channel + ':commands', name, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!edit && results) {
                this.bot.whisper(user.username, name + ' already exists, try !cmd edit or chose another name');
                return;
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
            };
            console.log("set", commObj.name, commObj);
            this.bot.redis.hset(channel + ':commands', commObj.name, JSON.stringify(commObj));
            this.bot.whisper(user.username, 'command ' + commObj.name + ' set');
        });
    }

    handleBroadcaster(channel, user, command, args) {
        switch (command) {
            case '!lvl':
            case '!level':
                try {
                    this.bot.redis.hset(channel + ':levels', args[0].toLowerCase(), args[1]);
                    this.bot.whisper(user.username, args[0].toLowerCase() + ' level set to ' + args[1]);
                } catch (err) {
                    console.log(err)
                }
                break;
            case '!cfg':
            case '!config':
                try {
                    switch(args[0]) {
                        case 'add':
                            var config = args[1].toLowerCase();
                            var value  = args[2].toLowerCase();
                            this.bot.redis.hexists(channel + ':config', config, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (results) {
                                    this.bot.whisper(user.username, 'config already set use !cfg edit instead');
                                    return;
                                }
                                if (this.bot.configs.indexOf(config) < 0) {
                                    this.bot.whisper(user.username, config + ' is not a valid config');
                                    return;
                                }
                                this.bot.redis.hset(channel + ':config', config, value);
                                this.bot.whisper(user.username, 'config ' + config + ' set to ' + value);
                                this.bot.setConfigForChannel(channel);
                            });
                            break;
                        case 'edit':
                            var config = args[1].toLowerCase();
                            var value  = args[2].toLowerCase();
                            this.bot.redis.hexists(channel + ':config', config, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!results) {
                                    this.bot.whisper(user.username, 'config isn\'t set use !cfg add instead');
                                    return;
                                }
                                if (this.bot.configs.indexOf(config) < 0) {
                                    this.bot.whisper(user.username, config + ' is not a valid config');
                                    return;
                                }
                                this.bot.redis.hset(channel + ':config', config, value);
                                this.bot.whisper(user.username, 'config ' + config + ' set to ' + value);
                                this.bot.setConfigForChannel(channel);
                            });
                            break;
                        case 'rm':
                        case 'remove':
                            var config = args[1].toLowerCase();
                            this.bot.redis.hexists(channel + ':config', config, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                if (!results) {
                                    this.bot.whisper(user.username, 'config isn\'t set, nothing to delete');
                                    return;
                                }
                                this.bot.redis.hdel(channel + ':config', args[1]);
                                this.bot.whisper(user.username, 'config ' + args[1] + ' deleted');
                                this.bot.setConfigForChannel(channel);
                                this.bot.channels[channel].config[args[1]] = null;
                            });
                            break;
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            case '!trust':
            case '!trusted':
                try {
                    switch (args[0]) {
                        case 'add':
                            this.bot.redis.hset(channel + ':trusted', args[1], '1');
                            this.bot.whisper(user.username, 'added ' + args[1] + ' to trusted');
                            break;
                        case 'rm':
                        case 'remove':
                            this.bot.redis.hset(channel + ':trusted', args[1], '0');
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
        try {
            switch (command) {
                case '!status':
                    var time = process.uptime();
                    var uptime = lib.secsToTime((time + ""));
                    this.bot.say(
                        channel,
                        '@' + user.username + ', uptime: ' + uptime
                        + ' | active in ' + lib.countProperties(this.bot.channels) + ' channels'
                    );
                    break;
                case '!join':
                    this.bot.irc.joinChannel(args);
                    break;
                case '!part':
                    this.bot.irc.partChannel(args);
                    break;
                case '!say':
                    var toSay = args.join(' ');
                    this.bot.say(channel, toSay);
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    }

}
