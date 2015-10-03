# gempbot
This is a nodejs twitchbot with a logging functionality that requires no webhosting.
This bot uses pastebin.com to give you the log files, but free accounts have a 30 pastes limit,
so I build in a feature that deletes every pastebin after 5 minutes after creation.

# Usage

Type **!status** to find out the current channels the bot is connected to.

Type **!logs username** to get a pastebin log of a single user with a timestamp.


# Installation
Download the Bot https://github.com/danielps1/gempbot/archive/master.zip

Download the node.js binary(.exe) (https://nodejs.org/download/) and place it inside the folder of the bot.
Open **gempbot.js** with a text editor of your choice


    var admin = 'user';
    
    
Here you set the admin for the bot, otherwise only mods can acess !logs and !status


    var PastebinAPI = require('pastebin-js'),
        pastebin = new PastebinAPI({
          'api_dev_key' : 'pastebindevkey',
          'api_user_name' : 'pastebinaccountname',
          'api_user_password' : 'pastebinpassword'
        });
    
    
Now you have to set the dev key from **pastebin** (http://pastebin.com/api) and your **username** and **password**.

    var options = {
        options: {
            debug: true
        },
        connection: {
            random: 'chat',
            reconnect: true
        },
        identity: {
            username: 'botaccountname',
            password: 'oauth:twitchauthkey'
        },
        channels: ['#gempir','#twitch']
    };
    
In this final part of the installation you have to type in your **twitchbot name** and under password the **authkey**.
You can find your twitch auth key by going to http://twitchapps.com/tmi
  
And finally change "channels" to the channel(s) you want to make the bot connect to.
Make sure to start with a **#**

Make sure you create a "logs" folder and inside folders with the channels the bot is connected to so the logs get saved correctly. So your structure looks like this: logs/gempir/gempir.txt
The file gempir.txt now contains everything the user "gempir" wrote inside the channel gempir

To now start the bot just run start.bat or open a nodejs prompt and start gempbot.js

# Credits 

This bot is possible because of this genius libary http://www.tmijs.org/
Check out the documentation for more features.

Used modules:
- https://github.com/Schmoopiie/tmi.js
- https://github.com/moment/moment/
- https://github.com/caolan/async
- https://github.com/j3lte/pastebin-js
- https://github.com/isaacs/node-graceful-fs

