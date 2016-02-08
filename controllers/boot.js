var config  = require('./config');
require('./chat');
var git     = require('git-rev-sync');
var cfg     = require('./../cfg');
var channel = require('./../connection/channel');
var whisper = require('./../connection/whisper');
var output  = require('./../connection/output');
var colors  = require('colors');

var groupConn = false;
var chat  = false;


channel.client.on("connected", function (address, port) {
    console.log('[boot] connected to chat'.green);
    chat = true;
    bootComplete();
});

whisper.group.on("connected", function (address, port, err) {
    console.log(('[boot] Connected to group servers on ' + address + ':' + port).green);
    groupConn = true;
    bootComplete();
});

whisper.group.on("disconnected", function (reason) {
    console.log(('[boot] group server connection failed | ' + reason).bgRed)
    whisper.group.connect();
});

channel.client.on("disconnected", function (reason) {
    console.log(('[boot] chat server connection failed | ' + reason).bgRed)
    channel.client.connect();
});

function bootComplete()
{
    if (groupConn && chat) {
        output.sayAllChannels('Bot started | branch: ' + git.branch() + ' (' + git.short() + ')');
    }
}
