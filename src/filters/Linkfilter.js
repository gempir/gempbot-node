import fs from 'fs';

export default class Linkfilter {
    constructor(bot)
    {
        this.bot    = bot;
        this.danger = 0;
        this.tlds   = [];
    }

    loadTLDs() {
        fs.readFile(__dirname + '/../../tlds.txt', 'utf8', (err, data) => {
            this.tlds = data.split('\r\n');
            console.log(this.tlds);
        });
    }

    evaluate(message) {
        if (message.indexOf('.') < 0) {
            this.danger--;
        }
        if (message.indexOf('(dot)') > -1 || message.indexOf('dot') > -1) {
            this.danger += 3;
        }
        if (message.match(/((?:http:\/\/)?)((?:www\.?)?)([\w\.-_]+)(?:\.|\s*\(dot\)\s*)(\w+)((?:\/[^\s]+)*)/i)) {
            return true;
        }
    }


}
