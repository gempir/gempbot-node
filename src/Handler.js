import CommandHandler from './CommandHandler';

export default class Handler {

    constructor(bot) {
        this.bot            = bot;
        this.commandHandler = new CommandHandler(bot);
    }

    filterMessage(channel, user, message) {
        var ascii  = false;
        var length = false;
        var links  = false;
        var reason = '';

        if (this.bot.getConfig(channel, 'ascii')) {
            links = this.bot.filters.isASCII(message);
            reason = 'ASCII';
        }
        if (this.bot.getConfig(channel, 'maxlength') && !ascii) {
            var maxlength =  this.bot.getConfig(channel, 'maxlength');
            if (message.length > maxlength) {
                length = true;
                reason = 'a message over the length limit';
            }
        }
        if (this.bot.getConfig(channel, 'links') && !ascii && !length) {
            ascii = this.bot.filters.evaluateLink(message);
            reason = 'a link in your message';
        }


        if (ascii || length || links) {
            this.bot.timeout.spam(channel, user.username, reason);
        }
    }

    handleDefault(channel, user, message) {
        var username = user.username;

        this.bot.modules.lines.recordLines(channel, username, message);
        this.bot.modules.emotecount.incrementEmotes(channel, user, message);
        this.bot.modules.oddshots.saveChannelOddshots(channel, username, message);
        this.bot.modules.combo.count(channel, user, message);
        this.bot.modules.logs.userLogs(channel, username, message);
        this.bot.modules.chatters.recordChatters(channel, username);
        this.bot.modules.nuke.recordToNuke(channel, user, message);
    }

    handleCommand(channel, user, command, args) {
        this.commandHandler.handle(channel, user, command, args);
    }
}
