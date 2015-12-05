# gempbot
This is a nodejs twitchbot with a logging functionality that requires no webhosting.
You just have to run a node app on your pc. 

I commit a lot because that's how I deploy to my server. Sorry If my commits are mostly worthless. 

# Features

Type **!status** to find out the current channels the bot is connected to.

Type **!logs 'username'** to get a pastebin log of a single user with a timestamp as a whisper.

Type **!count 'phrase'** to get the number of times the chat wrote that phrase, also works with sentences

Type **!countme 'phrase'** to get the number of times you used a specific phrase, this also works with sentences

Type **!status logs 'username'** to get the size report for a users log file

Type **!status logs channel** to get the size of the channel's log file 

Type **!lines 'username'** to get a line count for someones log file

Type **!randomquote 'username'** to get a randomquote from a users logs


# Installation
Download the Bot https://github.com/gempir/gempbot/archive/master.zip

Install nodejs from https://nodejs.org/

I have found out that node 4.2.1 works best. If you are having issues definetly try another node version.

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

Don't forget to install node modules with the npm like this:
  
    npm install
    
Now start the bot by opening a terminal/shell window and type node gempbot.js or nodejs gempbot.js 

The bot will create logs folder on it's own.


