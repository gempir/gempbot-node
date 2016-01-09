# gempbot

This bot is highly experimental and constantly changing. Don't consider all pushes to github stable since I test a lot.
This is also a fun oriented bot and less of a general channel bot. It does stuff like counting emotes for specific users or the whole chat.
And this is one of the strengths of this bot, it has built in logging completly usable without any webserver.
It uploads logs to pastebin and you don't have to host anything yourself.

Explore the modules folder to find out more features of my bot the eventHandler.js has all commands, if you are unsure where to look.


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


Create a MYSQL database and also fill in the information in the cfg file.

    Important:
        use the tables.sql file to create the tables


And finally change "channels" to the channel(s) you want to make the bot connect to.
Make sure to start with a **#**

Don't forget to install node modules with the npm like this:

    npm install

Now start the bot by opening a terminal/shell window and type node gempbot.js or nodejs gempbot.js

The bot will create logs folder on it's own.
