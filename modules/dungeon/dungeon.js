var fn            = require('./../functions');
var db            = require('./../db/connectDB');
var queries       = require('./../db/queries');
var output        = require('./../twitch/output');
var dngEnter      = require('./dungeonEnter');


function dungeonHandler(channel, user, message)
{
    var messageLowerCase = message.toLowerCase(); 


    if (messageLowerCase === '!dungeon') {
        queries.isDungeonUser(user.username, function(bool) {
        if (bool) {
            console.log(user.username + ' already in dungeon');
            return false;
        }
        if (!bool) {
            queries.setDungeon(user.username, function(result) {
                
            });
            output.whisper(user.username, "You're in Dungeon mode now. Type \"!dungeon enter\" to start.");
            console.log(user['username'] + ' went into Dungeon mode');
        }
        });
    }
    if (fn.getNthWord(messageLowerCase, 1) === '!dungeon' && messageLowerCase != '!dungeon') {
        queries.isDungeonUser(user.username, function(bool) {
            if (bool) {
                dungeonCommandHandler(channel, user, message);
            }
            else {
                output.whisper(user.username, 'You are not in dungeon mode yet. Enter Dungeon mode by typing "!dungeon"');
            }
        })
    }
    
}


function dungeonCommandHandler(channel, user, message)
{
    var dngCommand = fn.getNthWord(message.toLowerCase(), 2);

    if (dngCommand === 'status') {
        getStatus(user, channel);
    }
    if (dngCommand === 'enter') {
        queries.isActiveInDungeon(user.username, function(result) {
            if (result) {
                output.whisper(user.username, 'You\'re already in a dungeon. Wait for a response!');
            }
            else if (!result) {
                dngEnter.enterDungeon(user);
            }
        })        
    }
}


function getStatus(user, channel)
{
    queries.getDungeonStatusAndLevel(user.username, function(rows) {
        if (!rows) {
            return null;
        }
        var levelResponse = 'in dungeon level ' + rows[0].dungeonlevel;
        if (rows[0].dungeonstatus === 'BOSS') {
            output.whisper(user.username, 'You are currently on a boss ' + levelResponse);
        }
        else if (rows[0].dungeonstatus === 'DUNGEON') {
            output.whisper(user.username, 'You\'re ' + levelResponse + ' and there is still time left until the end.');
        }
        else if (rows[0].dungeonstatus === 'IDLE') {
            output.whisper(user.username, 'You\'re currently not in a dungeon type "!dungeon enter" to enter the next dungeon level');
        }
        else {
            return false;
        }
    });
}

module.exports = 
{
    dungeonHandler
}
