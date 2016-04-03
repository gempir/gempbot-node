export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
    }

    addEvent(channel, type, data)
    {
        switch (type) {
            case 'sub':
                break;
            case 'resub':
                break;
            case 'timeout':
                this.bot.modules.logs.userLogs(channel, 'timeouts', data);
                this.bot.redis.hset(channel + ":timeouts", new Date().getTime(), data);
                break;
            case 'ban':
                break;
            case 'streamonline':
                break;
            case 'streamoffline':
                break;
        }
    }

    subalert(username, months)
    {
        months = months || null
        if (months) {

        } else {

        }
    }

}
