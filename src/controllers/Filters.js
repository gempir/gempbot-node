import fs from 'fs';

export default class Filters {
    constructor(bot)
    {
        this.bot    = bot;
        this.tlds   = [];
        this.loadTLDs();
    }

    loadTLDs()
    {
        fs.readFile(__dirname + '/../../tlds.txt', 'utf8', (err, data) => {
            if (err) {
                return;
            }
            this.tlds = data.split('\r\n');
        });
    }

    isLink(message)
    {
        if (this.evaluateLink(message) > 5) {
            return true;
        } else {
            return false;
        }
    }

    evaluateLink(message)
    {
        var danger = 0;
        if (message.indexOf('.') > -1 || message.indexOf(',') > -1) {
            danger += 1;
        }
        if (message.indexOf('(dot)') > -1 || message.indexOf('dot') > -1) {
            danger += 5;
        }
        for (var i = 0; i < this.tlds.length; i++) {
            if (message.indexOf(this.tlds[i]) > -1) {
                danger += 5;
                break;
            }
        }
        if (this.danger === 0) {
            return danger;
        }
        if (message.match(/((?:http:\/\/)?)((?:www\.?)?)([\w\.-_]+)(?:\.|\s*\(dot\)\s*)(\w+)((?:\/[^\s]+)*)/i)) {
            danger += 5;
        }
        return danger;
    }

    evaluateLinkDeep(message)
    {
        // make a request for the link and scan the contents of the site and evaluate danger of texts and links in it
        // this should be used very rarely, because it's very expensive
    }

    evaluate(message)
    {
        var userlevel = 100;
        var ascii = this.isASCII(message);
        var links = this.isLink(message);
        var length = message.replace(' ','').length;

        return {
            userlevel: userlevel,
            length: length,
            ascii: ascii,
            links: links
        }
    }

    isASCII(message)
    {
        if (
               message.indexOf('▓') > -1
            || message.indexOf('░') > -1
            || message.indexOf('卐') > -1
            || message.indexOf('卍') > -1
            || message.indexOf('█') > -1
            || message.indexOf('─') > -1
        ) {
            return true;
        } else {
            return false;
        }
    }
}
