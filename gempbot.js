require('./overlay/overlay');
require('./controllers/boot');


var config = require('./controllers/config');

config.setGlobalCooldown('#nymn_hs');
//
// config.setCommand('#nymn_hs', {
//     command: '!followage',
//     message: '',
//     description: '',
//     enabled: true,
//     function: true
// });
