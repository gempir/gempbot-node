var parse = require('irc-message').parse;

export default class Parser {
    constructor(handler) {
      this.handler = handler;
      this.user    = {};
      this.emotes  = {};
      this.message = {};
      this.channel = {};
      this.action  = false;
      this.command = '';
      this.args    = [];
    }

    parseEmotes() {
        if (this.data.tags.emotes != true && typeof this.data.tags.emotes != 'undefined') {
            var emotesRaw = this.data.tags.emotes.split('/');
            for (var j = 0; j < emotesRaw.length; j++) {
                var emote = emotesRaw[j].split(':');
                var id    = emote[0];
                var pos   = emote[1];
                var pos = pos.split(',');
                this.emotes[id] = pos;
            }
        }
    }

    parseAction() {
        if (this.message.substring(1,8) == "ACTION ") {
            this.message = message.substr(8)
            this.message = message.substr(0, message.length-1)
            this.action  = true;
        }
    }

    parseParams() {
        this.data.params[0] = this.data.params[0] || '';
        this.data.params[1] = this.data.params[1] || '';
        this.channel = (this.data.params[0]).trim().toLowerCase();
        this.message = (this.data.params[1]).trim();
    }

    createUserObj() {
        this.user = {
            turbo: this.data.tags.turbo,
            emotes: this.emotes,
            subscriber: this.data.tags.subscriber,
            'user-type': this.data.tags['user-type'],
            username: ((this.data.prefix.split("!"))[0]).toLowerCase(),
            'display-name': this.data.tags['display-name'],
            action: this.action
        }
    }

    parseCommand() {
        var params   = this.message.split(" ");
        this.command = params[0].toLowerCase();
        params.splice(0, 1);
        this.args    = params;
    }

    parseData(data) {
        data = data.replace(/(\r\n|\n|\r)/gm,"");
        if (data.substr(0,1) != "@" || !(data.indexOf(" PRIVMSG ") > -1)) {
            // console.log("unhandeld: " + data);
            return;
        }
        this.data = parse(data);
        this.parseEmotes();
        this.parseParams();
        this.createUserObj();

        // handle always
        this.handler.handleDefault(this.channel, this.user, this.message);

        // filter
        this.handler.filterMessage(this.channel, this.user, this.message);

        // handle commands
        if (this.message.substring(0,1) === "!") {
            this.parseCommand();
            this.handler.handleCommand(this.channel, this.user, this.command, this.args);
        }
    }
}
