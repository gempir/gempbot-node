
import CommandHandler from './controllers/CommandHandler';

export default class Handler {

    constructor(bot) {
        this.bot            = bot;
        this.commandHandler = new CommandHandler(bot);
    }

    filterMessage(channel, user, message) {

    }

    handleDefault(channel, user, message) {
        var username = user.username;

        this.bot.modules.lines.recordLines(channel, username, message);
        this.bot.modules.emotelog.incrementUserEmote(channel, user, message);
        this.bot.modules.emotelog.incrementEmote(channel, user, message);
        this.bot.modules.oddshots.saveChannelOddshots(channel, username, message);
        this.bot.modules.combo.count(channel, user, message);
        this.bot.modules.logs.userLogs(channel, username, message);
        this.bot.modules.chatters.recordChatters(channel, username, message);
        this.bot.modules.nuke.recordToNuke(channel, user, message);
    }

    handleCommand(channel, user, command, args) {
        this.commandHandler.handle(channel, user, command, args);
    }
}
