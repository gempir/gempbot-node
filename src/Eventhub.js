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
            console.log(`[sub] ${channel} ${username} ${months}`)
        } else {
            console.log(`[sub] ${channel} ${username}`)
        }
    }

}
