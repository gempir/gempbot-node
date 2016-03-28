import fn from './../controllers/functions';
import fs from 'fs';

export default class LastMessage
{
    constructor(bot)
    {
        this.bot = bot;
    }

    lastMessage(channel, username, lastMessageFor, prefix) {
        lastMessageFor = lastMessageFor.toLowerCase();
    	var file = '../logs/' + channel.substr(1) + '/' + lastMessageFor + '.txt';

    	if (!fn.fileExists(file)) {
    		return false;
    	}

    	fs.readFile(file, (err, data) => {
            data = data.toString();

            var lines = data.split('\n');
            var lastLine = lines[lines.length-2];
            lastLine = lastLine.split(']');

            var response = lastLine[1];

            if (fn.containsASCII(response) || fn.stringContainsUrl(response))  {
                return false;
            }
            if (response.length > 120) {
                response = response.substring(0, 120) + ' [...]';
            }
            this.bot.say(channel, prefix + response);
        });
    }
}
