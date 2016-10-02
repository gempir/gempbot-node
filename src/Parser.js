var parse = require('irc-message').parse;

export default class Parser {
    constructor(bot) {
      this.bot      = bot;
      this.isAction = false;
    }

    parseData(data) {
        data = parse(data);
        switch(data.command) {
            case 'PRIVMSG':
                this.parseMessage(data);
                break;
            default:
                break;
        }
    }

    parseTimeout(data)
    {
        this.bot.eventhub.emitEvent(data.params[0], 'timeout', data.params[1]);
    }


    parseMessage(data) {
        var channel = this.getChannel(data);
        var user    = {
            emotes: this.getEmotes(data),
            'message-type': this.getAction(data),
            'user-type': data.tags['user-type'],
            'display-name': data.tags['display-name'],
            username: ((data.prefix.split("!"))[0]).toLowerCase(),
            turbo: data.tags.turbo,
            subscriber: data.tags.subscriber,
        }
        var message = this.getMessage(data);

        if (user.username === "twitchnotify") {
            if (message.includes("subscribed to")) {
                // hosted channel got a subscriber
            }
            // New subscriber..
            else if (message.includes("just subscribed")) {
                this.bot.eventhub.emitEvent(channel, 'subcription', { username: message.split(" ")[0] });
            }
            // Subanniversary..
            else if (message.includes("subscribed") && message.includes("in a row")) {
                var splitted = message.split(" ");
                var length = splitted[splitted.length - 5];
                this.bot.eventhub.emitEvent(channel, 'subanniversary', { username: splitted[0], months: length});
            }
        }
        if (this.bot.admins.indexOf(user.username) > -1) {
            user['user-type'] = 'admin';
        }
        this.bot.handler.handle(channel, user, message);
    }


    getEmotes(data) {
        var emotes = {};
        if (data.tags.emotes != true && typeof data.tags.emotes != 'undefined') {
            var emotesRaw = data.tags.emotes.split('/');
            for (var j = 0; j < emotesRaw.length; j++) {
                var emote  = emotesRaw[j].split(':');
                var id     = emote[0];
                var pos    = emote[1];
                var pos    = pos.split(',');
                emotes[id] = pos;
            }
        }
        return emotes;
    }

    getAction(data) {
        if (data.params[1].match(/^\u0001ACTION ([^\u0001]+)\u0001$/)) {
            this.isAction = true;
            return 'action';
        } else {
            this.isAction = false;
            return '';
        }
    }

    getMessage(data) {
        var message = data.params[1] || '';
        if (this.isAction) {
            message = message.replace(/^\u0001ACTION /,'');
            message = message.replace(/\u0001$/,'');
        }
        message = message.trim();
        return message;
    }

    getChannel(data) {
        var channel = data.params[0] || '';
        channel = channel.trim().toLowerCase();
        return channel;
    }

    getCommandAndArgs(message) {
        var args    = message.split(" ");
        var command = args[0].toLowerCase();
        args.splice(0, 1);
        return {
            command: command,
            args: args
        }
    }
}
