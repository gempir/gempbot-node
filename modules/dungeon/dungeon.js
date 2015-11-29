var fn       = require('./../functions');
var db       = require('./../db/connectDB');
var queries  = require('./../db/queries');
var output   = require('./../twitch/output');

function dungeonHandler(channel, user, message)
{
    var messageLowerCase = message.toLowerCase(); 


    if (messageLowerCase === '!dungeon') {
        queries.isInDungeon(user.username, function(bool) {
        if (bool) {
            console.log(user.username + ' already in dungeon');
            return false;
        }
        if (!bool) {
            queries.setDungeonStatus(user.username, "ACTIVE", function(result) {
                
            });
            output.whisper(user.username, "You're in Dungeon mode now. More coming soon");
            console.log(user['username'] + ' went into Dungeon mode');
        }
        });
    }
    if (fn.getNthWord(messageLowerCase, 1) === '!dungeon' && messageLowerCase != '!dungeon') {
        queries.isInDungeon(user.username, function(bool) {
            if (bool) {
                dungeonCommandHandler(channel, user, message);
            }
            else {
                output.whisper(user.username, 'You are not in dungeon mode yet. Enter Dungeon mode by typing !dungeon');
            }
        })
    }
    
}


function dungeonHandler(channel, user, message)
{


}

module.exports = 
{
    dungeonHandler
}
