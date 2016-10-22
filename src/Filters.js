export default class Filters {
    constructor(bot)
    {
        this.bot        = bot;
    }

    isLink(message)
    {
        if (this.evaluateLink(message) >= 5) {
            return true;
        } else {
            return false;
        }
    }

    evaluateLink(message)
    {
        message = ` ${message} `;
        var danger = 0;
        if (message.indexOf('.') > -1) {
            danger += 1;
        }
        if (message.indexOf('(dot)') > -1 || message.indexOf('dot') > -1) {
            danger += 5;
        }
        if (message.match(/((?:http:\/\/)?)((?:www\.?)?)([\w\.-_]+)(?:\.|\s*\(dot\)\s*)(\w+)((?:\/[^\s]+)*)/i)) {
            danger += 5;
        }
        return danger;
    }

    evaluate(channel, message)
    {
        var danger = this.evaluateLink(message);
        var ascii  = this.isASCII(message);
        var links  = false;
        var length = message.length;

        if (danger > 5) {
            links = true;
        }
        if (ascii) {
            danger += 10;
        }

        return {
            length: length,
            ascii: ascii,
            links: links,
            danger: danger
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
