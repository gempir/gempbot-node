import moment from 'moment';

export default class Database {
    constructor(bot)
    {
        this.bot = bot;
    }


    insertSub(channel, username, months, callback)
    {
        var values = [channel, username, months];
        this.bot.mysql.query("INSERT INTO subscriptions (channel, username, months) VALUES (?, ?, ?)", values, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (callback) {
                callback(err, results);
            }
        });
    }

    insertLogEntry(channel, username, message)
    {
        var timestamp =  moment.utc().format("YYYY-MM-DD HH:mm:ss");
        this.bot.mysql.query("INSERT INTO `chatlogs` (channel, timestamp, username, message) VALUES (?, ?, ?, ?)", [channel, timestamp, username, message], function(err, results) {
            if (err) {
                console.log(err);
            }
        });
    }
}
