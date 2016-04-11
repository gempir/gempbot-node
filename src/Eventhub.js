export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
    }

    emitEvent(channel, type, data)
    {
        switch (type) {
            case 'subcription':
                this.bot.db.insertSub(channel, data.username, null);
                this.subAlert(channel, data.username, null);
                break;
            case 'subanniversary':
                this.bot.db.insertSub(channel, data.username, data.months);
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
            // resub
        } else {
            // sub
        }
    }

}
