process.on('uncaughtException', function (err) {
    console.log(err);
});

require('nice-console')(console);
require('./src/overlay/overlay');
import Bot from './src/Bot';

var bot = new Bot();

