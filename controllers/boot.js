var config  = require('./config');
require('./chat');
var git     = require('git-rev-sync');
var cfg     = require('./../cfg');
var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var output  = require('./../connection/output');
var colors  = require('colors');
var bttv    = require('./getBTTVEmotes');

var group = false;
var chat  = false;

// boot
(function(){
    bttv.loadBTTVEmotes();
})();

channel.client.on("connected", function (address, port) {
    console.log('[boot] connected to chat'.green);
    chat = true;
    bootComplete();
});

whisper.group.on("connected", function (address, port, err) {
    console.log(('[boot] Connected to group servers on ' + address + ':' + port).green);
    group = true;
    bootComplete();
});

whisper.group.on("disconnected", function (reason) {
    console.log(('[boot] group server connection failed | ' + reason).bgRed)
    process.exit(); // restart bot when not connected to group servers, because whispers won't work otherwise
});


function bootComplete()
{
    if (group && chat) {
        output.sayAllChannels('Bot started | branch: ' + git.branch() + ' (' + git.short() + ')');
    }
}
