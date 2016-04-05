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
}
