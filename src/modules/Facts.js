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
        this.bot.mysql.query("\
            SELECT fact\
              FROM facts AS r1 JOIN\
                   (SELECT CEIL(RAND() *\
                                 (SELECT MAX(id)\
                                    FROM facts)) AS id)\
                    AS r2\
            WHERE r1.id >= r2.id\
            AND channel = ?\
            ORDER BY r1.id ASC\
            LIMIT 1\
        ", [channel], (err, results) => {
            if (err || results.length == 0) {
                console.log(err, results);
                return;
            }
            this.bot.say(channel, results[0].fact);
        });
    }
}
