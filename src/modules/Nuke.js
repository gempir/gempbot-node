
import fn from './../controllers/functions';

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
        try {
            if (!(this.activeNukes.indexOf(channel) > -1)) {
                return false;
            }

            if (user['user-type'] === 'mod') {
                return false;
            }

            if (typeof this.toNuke[channel] === 'undefined') {
        		this.toNuke[channel] = [];
        	}
            if (this.toNuke[channel].indexOf(user.username) > -1) {
                return false;
            }
            this.toNuke[channel].push(user.username);
        } catch (err) {
            console.log(err);
        }
    }

    nuke(channel, username)
    {
        if (this.activeNukes.indexOf(channel) > -1) {
            return false;
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
                return false;
            }
            for (var index = 0; index < this.toNuke[channel].length; index++) {
                this.bot.say(channel, '/timeout ' + this.toNuke[channel][index] + ' 1');
            }
            console.log('[LOG] nuking:' + this.toNuke[channel]);
            this.bot.say(channel, '/me VaultBoy NUKED ' + this.toNuke[channel].length + ' CHATTERS VaultBoy');
            fn.removeFromArray(this.activeNukes, channel);
            console.log(this.activeNukes);
            this.toNuke[channel] = [];
        }, this.nukeLength * 1000);
    }
}
