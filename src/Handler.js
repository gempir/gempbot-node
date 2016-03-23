


export default class Handler {

    constructor(controllers, models, modules) {
        this.controllers = controllers;
        this.models      = models;
        this.modules     = modules;
    }

    handleMessage(channel, user, message) {
        this.handleDefault(channel, user, message);
    }

    handleDefault(channel, user, message) {
        var username = user.username;

        this.modules.lines.recordLines(channel, username, message);
        this.modules.emotelog.incrementUserEmote(channel, user, message);
        this.modules.emotelog.incrementEmote(channel, user, message);
        this.modules.oddshots.saveChannelOddshots(channel, username, message);
        this.modules.combo.count(channel, user, message);
        this.modules.logs.userLogs(channel, username, message);
        this.modules.chatters.recordChatters(channel, username, message);
        this.modules.nuke.recordToNuke(channel, user, message);
    }
}
