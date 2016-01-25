var config  = require('./config');
var commands = require('./commands');
require('./chat');
var git     = require('git-rev-sync');
var cfg     = require('./../cfg');
var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var output  = require('./../connection/output');

// stuff to do on boot
config.refreshTrusted();
config.setCooldowns();
commands.refreshActiveCommands();
commands.refreshLoggedCommands();


var group = false;
var chat  = false;

channel.client.on("connected", function (address, port) {
    console.log('[BOOT] connected to chat');
    chat = true;
    bootComplete();
});

whisper.group.on("connected", function (address, port, err) {
    console.log('[BOOT] Connected to group servers on ' + address + ':' + port);
    group = true;
    bootComplete();
});

whisper.group.on("disconnected", function (reason) {
    process.exit(); // restart bot when not connected to group servers, because whispers won't work otherwise
});


function bootComplete()
{
    if (group && chat) {
        output.sayAllChannels('Bot started | branch: ' + git.branch() + ' (' + git.short() + ')');
    }
}
