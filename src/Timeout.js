import lib from './lib';

export default class Timeout {
    constructor(bot)
    {
        this.bot = bot;
        this.timeouts = {};
    }

    spam(channel, username, reason)
    {
        var stage = this.timeouts[username];
        if (typeof stage == "undefined") {
            var stage = 0;
        }
        if (stage <= 0) {
            this.timeouts[username] = 1;
            this.bot.say(channel, '/timeout ' + username + ' 10');
            this.bot.whisper(username, 'You have been timed out 10s for ' + reason)
            setTimeout(() => {
                this.timeouts[username] -= 1;
            }, 300000);
            return;
        }
        if (stage == 1 ) {
            this.timeouts[username] += 2;
            this.bot.say(channel, '/timeout ' + username + ' 30');
            this.bot.whisper(username, 'You have been timed out 30s for ' + reason)
            setTimeout(() => {
                this.timeouts[username] -= 2;
            }, 300000);
            return;
        }
        if (stage >= 2) {
            this.timeouts[username] += 3;
            this.bot.say(channel, '/timeout ' + username + ' 90');
            this.bot.whisper(username, 'You have been timed out 90s for ' + reason)
            setTimeout(() => {
                this.timeouts[username] -= 3;
            }, 300000);
            return;
        }
    }

}
