var cfg    = require('./../../cfg');
var redis  = require('redis'),
    client = redis.createClient(cfg.redis);

client.auth(cfg.redis.password);

client.on('connect', function() {
    console.log('[redis] connected');
});

client.on("error", function (err) {
    console.log("[redis] error: " + err);
});

module.exports = client;
