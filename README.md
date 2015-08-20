# gempbot
This is a nodejs twitchbot with a logging functionality that requires no webhosting.
Right now this bot doesn't do much. If you want a simple log bot then this is perfect. 

# Features
- Logs
- Subscriber notification
- Status

# Usage

Type **!status** to find out the current channels the bot is connected to.

Type **!logs username** to get a pastebin log of a single user with a timestamp.


# Installation
Install **nodejs** (http://nodejs.org/) on whatever you want the bot to run on.
Open **gempbot.js** with a text editor of your choice


    var admins = ['gempir','admin'];
    
    
Here you can setup admins for your bot. 


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

# Credits 

This bot is possible because of this genius libary http://www.tmijs.org/
Check out the documentation for more features.

Used modules:
- https://github.com/Schmoopiie/tmi.js
- https://github.com/moment/moment/
- https://github.com/caolan/async
- https://github.com/j3lte/pastebin-js

