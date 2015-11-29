var db = require('./connectDB');


function log(channel, user, message)
{
	db.select('SELECT id FROM users WHERE username = ? ', [user.username], function(rows) {
		if (rows.length > 0) {
			return null;
		}
		db.update('INSERT INTO users (username, dungeonstatus) VALUES (?,"NONE")', [user.username], function(result) {
			console.log('new DB Entry for ' + user.username);
			return result;
		})

	})
}

module.exports = 
{
	log
}