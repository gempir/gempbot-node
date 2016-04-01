import fs from 'fs';

export default class Linkfilter {
    constructor(bot)
    {
        this.bot    = bot;
        this.danger = 0;
    }

    findCommonWords() {
        //(\w+)(?:\.|\s*\(dot\)\s*)(\w+)((?:\/[^\s]+)*)`
    }

    evaluate(message) {
        if (message.indexOf('.') < -1) {

        }
    }


}
