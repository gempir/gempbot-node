var db = require('./connectDB');


function isInDungeon(username, callback) 
{
	db.select('SELECT * FROM users WHERE dungeonstatus != "NONE" AND username  = ?', [username], function(rows){
  		if (rows.length > 0) {
  			return callback(true);
  		}
  		return callback(false);
	});
}

function setDungeonStatus(username, status, callback) 
{
	db.update('UPDATE users SET dungeonstatus = ? WHERE username  = ?', [status, username], function(result){
  		return result;
	});
}


module.exports = 
{
	isInDungeon,
	setDungeonStatus
}

