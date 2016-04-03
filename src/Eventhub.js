export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
        this.date = new Date();
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
                this.bot.redis.hset(channel + ":timeouts", this.date.getTime(), data);
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
