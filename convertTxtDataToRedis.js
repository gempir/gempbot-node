var bttv   = require('./controllers/getBTTVEmotes');
var twitch = require('./controllers/getTwitchEmotes');
var redis  = require('./controllers/redis');
var fs     = require('graceful-fs');
var emotelog = require('./modules/emotelog');
bttv.loadBTTVEmotes();

twitch.loadTwitchEmotes(function(){
    var TEmotes = swap(twitch.TwitchEmotes);

    function readFiles(dirname) {
      fs.readdir(dirname, function(err, filenames) {
        if (err) {
          return;
        }
        for (var i = 0; i < filenames.length; i++) {
            countInFile(filenames[i], dirname);
        }
      });
    }


    setTimeout(function() {
        readFiles('logs/gempir/');
    }, 5000);


    function countInFile(filename, dirname) {
        fs.readFile(dirname + filename, 'utf-8', function(err, content) {
          if (err) {
            return;
          }
          var messageArr = content.split(' ');
          for (var i = 0; i < messageArr.length; i++) {
            // bttvemotes
            if (bttv.BetterTTVEmotes.global.indexOf(messageArr[i]) > -1 || bttv.BetterTTVEmotes.channel['#gempir'].indexOf(messageArr[i]) > -1) {
                  redis.hincrby('#gempir' + ':emotelog:user:' + messageArr[i], filename.substr(0, filename.length - 4), 1);
                  redis.hincrby('#gempir' + ':emotelog:channel', messageArr[i], 1);
                  console.log(messageArr[i], filename);
            }
            // twitchemotes
            if (Object.keys(TEmotes).indexOf(messageArr[i]) > -1) {
                redis.hincrby('#gempir' + ':emotelog:user:' + messageArr[i], filename.substr(0, filename.length - 4), 1);
                redis.hincrby('#gempir' + ':emotelog:channel', messageArr[i], 1);
                 console.log(messageArr[i], filename);
            }
          }
        });
    }



});
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}
