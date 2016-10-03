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

        // handle commands
        if (message.substring(0,1) === "!") {
            var parsed = this.bot.parser.getCommandAndArgs(message);
            this.handleCommand(channel, user, parsed.command, parsed.args);
        }
    }

    handleDefault(channel, user, message) {
        var username = user.username;
        this.bot.overlay.emit("message", { channel: channel, user: user, message: message})
        this.bot.modules.combo.count(channel, user, message);
        this.bot.modules.nuke.recordToNuke(channel, user, message);
    }

    handleCommand(channel, user, command, args) {
        this.commandHandler.handle(channel, user, command, args);
    }
}
