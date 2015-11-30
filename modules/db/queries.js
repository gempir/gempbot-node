var db = require('./connectDB');


function isDungeonUser(username, callback) 
{
	db.select('SELECT * FROM users WHERE dungeon = 1 AND username  = ?', [username], function(rows){
  		if (rows.length > 0) {
  			return callback(true);
  		}
  		return callback(false);
	});
}

function setAllUsersToIdle(callback) {
	db.update('UPDATE users SET dungeonstatus = ?', ['IDLE'], function(result){
  		return callback(result);
	});
}


function isActiveInDungeon(username, callback) 
{
	db.select('SELECT dungeonstatus FROM users WHERE username  = ?', [username], function(rows){
  		if (rows.length > 0) {
  			if (rows[0].dungeonstatus != 'IDLE') {
  				return callback(true);
  			}
  			return callback(false);
  		}
  		return callback(false);
	});
}

function setDungeon(username, callback) 
{
	db.update('UPDATE users SET dungeon = ?, dungeonlevel = ?, dungeonstatus = ? WHERE username  = ?', [1, 0, 'IDLE', username], function(result){
  		return callback(result);
	});
}

function getDungeonStatusAndLevel(username, callback)
{
	db.select('SELECT dungeonstatus,dungeonlevel FROM users WHERE username = ?', [username], function(rows) {
		if (rows.length > 0) {
  			return callback(rows);
  		}
  		return callback(false);
	});
}

function incrementDungeonLevel(username, callback)
{
	db.select('SELECT dungeonlevel FROM users WHERE username = ?', [username], function(rows) {
		if (rows.length > 0) {
  			var dungeonLevel = rows[0].dungeonlevel;
  			db.update('UPDATE users SET dungeonlevel = ? WHERE username  = ?', [dungeonLevel + 1 , username], function(result){
  				return callback(result);
			});
  		}
  		return callback(false);
	});
}

function decrementDungeonLevel(username)
{
	db.select('SELECT dungeonlevel FROM users WHERE username = ?', [username], function(rows) {
		if (rows.length > 0) {
  			var dungeonLevel = rows[0].dungeonlevel;
  			db.update('UPDATE users SET dungeonlevel = ? WHERE username  = ?', [dungeonLevel - 1 , username], function(result){
  				return result;
			});
  		}
  		return false;
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
	isDungeonUser,
	setDungeon,
	getDungeonStatusAndLevel,
	isActiveInDungeon,
	incrementDungeonLevel,
	setDungeonStatus,
	setAllUsersToIdle,
	decrementDungeonLevel
}

