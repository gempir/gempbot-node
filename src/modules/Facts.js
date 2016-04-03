export default class Facts {
    constructor(bot)
    {
        this.bot = bot;
    }

    addFact(channel, username, fact)
    {

        this.bot.mysql.query('INSERT INTO facts (channel, fact) VALUES (?, ?)', [channel, fact], (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            this.bot.whisper(username, 'successfully added your fact');
        });
    }

    removeFact(channel, username, fact)
    {
        this.bot.mysql.query('DELETE FROM facts WHERE channel = ? AND fact = ?', [channel, fact], (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            this.bot.whisper(username, 'successfully removed your fact');
        });
    }

    sayFact(channel)
    {
        this.bot.mysql.query('SELECT fact FROM facts WHERE channel = ? ORDER BY RAND() LIMIT 1', [channel], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            this.bot.say(channel, results[0].fact);
        });
    }
}
