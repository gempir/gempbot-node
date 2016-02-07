var cfg    = require('./../cfg');
var colors = require('colors');
var redis  = require('redis'),
    client = redis.createClient(cfg.redis);

client.auth(cfg.redis.password);

client.on('connect', function() {
    console.log('[redis] connected'.green);
});

client.on("error", function (err) {
    console.log(("[redis] error: " + err).bgRed);
});

module.exports = client;
