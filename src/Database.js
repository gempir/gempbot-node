import moment from 'moment';

export default class Database {
    constructor(bot)
    {
        this.bot = bot;
    }


    insertSub(channel, username, months, callback)
    {
        var timestamp =  moment.utc().format("YYYY-MM-DD HH:mm:ss");
        var values = [channel, timestamp, username, months];
        this.bot.mysql.query("INSERT INTO subscriptions (channel, timestamp, username, months) VALUES (?, ?, ?, ?)", values, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (callback) {
                callback(err, results);
            }
        });
    }
}
