export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
    }

    emitEvent(channel, type, data)
    {
        switch (type) {
            case 'subcription':
                this.subAlert(channel, data.username, null);
                break;
            case 'subanniversary':
                this.subAlert(channel, data.username, data.months);
                break;
            case 'timeout':
                break;
            case 'ban':
                break;
            case 'streamonline':
                break;
            case 'streamoffline':
                break;
        }
    }

    subAlert(channel, username, months)
    {
        if (months) {
            var obj = {
                username: username,
                months: months
            };
            this.bot.redis.publish(`${channel}:subs`, JSON.stringify(obj))
            this.bot.redis.hset(`${channel}:subs`, username, months);
            console.log(`[sub] ${channel} ${username} ${months}`)
        } else {
            var obj = {
                username: username,
                months: 1
            };
            this.bot.redis.publish(`${channel}:subs`, JSON.stringify(obj))
            this.bot.redis.hset(`${channel}:subs`, username, 1);
            console.log(`[sub] ${channel} ${username}`)
        }
    }

}
