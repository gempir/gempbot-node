import lib from './../lib';

export default class Nuke
{
    constructor(bot)
    {
        this.bot         = bot;
        this.nukeLength  = 30;
        this.activeNukes = [];
        this.toNuke      = {};
    }

    recordToNuke(channel, user, message)
    {

        if (this.activeNukes.indexOf(channel) < 0) {
            return;
        }
        if (user['user-type'] === 'mod') {
            return;
        }
        if (typeof this.toNuke[channel] === 'undefined') {
    		this.toNuke[channel] = [];
    	}
        if (this.toNuke[channel].indexOf(user.username) > -1) {
            return;
        }
        this.toNuke[channel].push(user.username);
    }

    nuke(channel, username)
    {
        if (this.activeNukes.indexOf(channel) > -1) {
            return;
        }
        this.activeNukes.push(channel);
        this.bot.say(channel, '/me VaultBoy THIS CHAT WILL BE NUKED IN 30 SECONDS VaultBoy');

        for (var x = 0; x < (this.nukeLength - 1) ; x++) {
            ((index) => {
                setTimeout(() => {
                    if ((index / this.nukeLength) > 0.80) {
                        this.bot.say(channel, index % 2 == 0 ? 'Tock...' : 'Tick...');
                    }
                }, index*1000)
            })(x);
        }

        setTimeout(() => {
            if (typeof this.toNuke[channel] === 'undefined') {
                this.bot.say(channel, 'No targets found!');
                return;
            }
            for (var index = 0; index < this.toNuke[channel].length; index++) {
                this.bot.say(channel, '/timeout ' + this.toNuke[channel][index] + ' 1');
            }
            this.bot.say(channel, `/me ANELE NUKED ${this.toNuke[channel].length} CHATTERS ANELE`);
            lib.removeFromArray(this.activeNukes, channel);
            this.toNuke[channel] = [];
        }, this.nukeLength * 1000);
    }
}
