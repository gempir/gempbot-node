import fn from './../controllers/functions';
import fs from 'fs';

export default class LastMessage
{
    constructor(bot)
    {
        this.bot  = bot;
        this.logs = this.logs = __dirname +'/../../../logs/';
        this.date      = new Date();
        this.month     = [];
        this.month[0]  = "January";
        this.month[1]  = "February";
        this.month[2]  = "March";
        this.month[3]  = "April";
        this.month[4]  = "May";
        this.month[5]  = "June";
        this.month[6]  = "July";
        this.month[7]  = "August";
        this.month[8]  = "September";
        this.month[9]  = "October";
        this.month[10] = "November";
        this.month[11] = "December";
    }

    lastMessage(channel, username, lastMessageFor, prefix) {
        lastMessageFor = lastMessageFor.toLowerCase();
    	var file = this.logs + channel.substr(1) + '/' + this.date.getFullYear() + '/' + this.month[this.date.getMonth()] + '/' + lastMessageFor + '.txt';

    	if (!fn.fileExists(file)) {
    		return false;
    	}

    	fs.readFile(file, (err, data) => {
            data = data.toString();

            var lines = data.split('\n');
            var lastLine = lines[lines.length-2];
            lastLine = lastLine.split(']');

            var response = lastLine[1];
            var filters = this.bot.filters.evaluate(response);
            if (filters.length > 200 || filters.ascii || filters.links) {
                return false;
            }
            if (response.length > 120) {
                response = response.substring(0, 120) + ' [...]';
            }
            this.bot.say(channel, prefix + response);
        });
    }
}
