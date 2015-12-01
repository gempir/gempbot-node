var fn            = require('./../functions');
var db            = require('./../db/connectDB');
var queries       = require('./../db/queries');
var output        = require('./../twitch/output');


function enterDungeon(user)
{
	queries.setDungeonStatus(user.username, 'DUNGEON', function(result) {});
	queries.incrementDungeonLevel(user.username, function(result) {
		if (result){
			queries.getDungeonStatusAndLevel(user.username, function(rows) {
				output.whisper(user.username, 'You are now in dungeon level ' + rows[0].dungeonlevel + ' wait 1min until you either fail or win');
			});
		}

	});
	startTimer(user);
}


function startTimer(user)
{
	queries.getDungeonStatusAndLevel(user.username, function(rows) {
		var dungeonLevel = rows[0].dungeonlevel;
		var interval;

		setTimeout(function() {
			finishDungeon(user.username, dungeonLevel + 1);
			clearInterval(interval);
			return true;
		}, 60000);	

		interval = setInterval(function() {
			if (!failDungeon(user.username, dungeonLevel + 1)) {
				clearInterval(interval);
				return false;
			}
		}, 5000);

		// for future boss additions 
		/*setInterval(function(user) {
			queries.setDungeonStatus(user.username, 'BOSS', function(result){})
		})*/
	})
}


function finishDungeon(username, dungeonLevel) {
	queries.setDungeonStatus(username, 'IDLE', function(result){})
	dungeonLevel = dungeonLevel + 1;
	output.whisper(username, 'You finished dungeon level ' + dungeonLevel);
	return true;
}

function failDungeon(username, dungeonLevel) {
	// roll the dice 
	if (fn.getRandomInt(0,100) > 95) {
		queries.setDungeonStatus(username, 'IDLE', function(result){})
		queries.decrementDungeonLevel(username);
		output.whisper(username, 'You failed the dungeon level ' + dungeonLevel);
		console.log('[LOG] ' + username + ' failed level ' + dungeonLevel);
		return false;
	}
	console.log('[LOG] ' + username + ' didn\'t fail level ' + dungeonLevel);
	return true;
}



module.exports = 
{
	enterDungeon
}