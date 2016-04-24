export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
    }

    emitEvent(channel, type, data)
    {
        switch (type) {
            case 'subcription':
                break;
            case 'subanniversary':
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


}
