# gempbot
This is a nodejs twitchbot with a logging functionality that requires no webhosting.
This bot uses pastebin.com to give you the log files, but free accounts have a 30 pastes limit,
so I build in a feature that deletes every pastebin after 5 minutes after creation.

It also can count phrases used in your chat. 

In the logs folder you have .txt files for you account which hold the whole chat history and in the folder for you channel you have history for each user who typed something.

# Usage

Type **!status** to find out the current channels the bot is connected to.

Type **!logs username** to get a pastebin log of a single user with a timestamp.

Type **!count phrase** to get the number of times the chat wrote that phrase, also works with sentences

Type **!countme phrase** to get the number of times you used a specific phrase, this also works with sentences


# Installation
Download the Bot https://github.com/danielps1/gempbot/archive/master.zip

Install nodejs from https://nodejs.org/

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

Now start the bot by opening a terminal/shell window and type node gempbot.js or nodejs gempbot.js 

The bot will create logs folder on it's own.

# Credits 

This bot is possible because of this genius libary http://www.tmijs.org/
Check out the documentation for more features.

Used modules:
- https://github.com/Schmoopiie/tmi.js
- https://github.com/moment/moment/
- https://github.com/caolan/async
- https://github.com/j3lte/pastebin-js
- https://github.com/isaacs/node-graceful-fs

