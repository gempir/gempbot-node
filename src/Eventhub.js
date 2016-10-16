export default class Eventhub {
    constructor(bot)
    {
        this.bot = bot;
    }

    emitEvent(channel, type, data)
    {
        switch (type) {
            case 'subcription':
                console.log(channel, data);
                break;
            case 'subanniversary':
                console.log(channel, data);
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
