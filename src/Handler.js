import CommandHandler from './CommandHandler';

export default class Handler {

    constructor(bot) {
        this.bot            = bot;
        this.commandHandler = new CommandHandler(bot);
    }

    handle(channel, user, message)
    {
        // handle always
        this.handleDefault(channel, user, message);

        // filter
        this.filterMessage(channel, user, message);

        // handle commands
        if (message.substring(0,1) === "!") {
            var parsed = this.bot.parser.getCommandAndArgs(message);
            this.handleCommand(channel, user, parsed.command, parsed.args);
        }
    }

    filterMessage(channel, user, message) {
        var cfgLength = this.bot.getConfig(channel, 'maxlength');
        var cfgASCII  = this.bot.getConfig(channel, 'ascii');
        var cfgLinks  = this.bot.getConfig(channel, 'links');
        var ascii  = false;
        var length = false;
        var links  = false;
        var reason = '';

        if ((cfgASCII == true || cfgASCII == 1) && cfgASCII != null) {
            links = this.bot.filters.isASCII(message);
            reason = 'ASCII';
        }
        if ((!isNaN(cfgLength) && cfgLength != 0 && cfgLength != null) && !ascii) {
            if (message.length > cfgLength) {
                length = true;
                reason = 'a message over the length limit';
            }
        }
        if ((cfgLinks == true || cfgLinks == 1) && cfgLinks != null && !ascii && !length) {
            ascii = this.bot.filters.evaluateLink(message);
            reason = 'a link in your message';
        }
    }

    handleDefault(channel, user, message) {
        var username = user.username;
        this.bot.modules.combo.count(channel, user, message);
        this.bot.modules.nuke.recordToNuke(channel, user, message);
    }

    handleCommand(channel, user, command, args) {
        this.commandHandler.handle(channel, user, command, args);
    }
}
