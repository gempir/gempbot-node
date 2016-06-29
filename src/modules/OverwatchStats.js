import request from 'request';

export default class OverwatchStats
{
    constructor(bot)
    {
        this.bot          = bot;
    }

    getChannelStats(channel, username, args, prefix)
    {
        var btag = this.bot.getConfig(channel, 'btag');
        if (!btag) {
            console.log("streamer btag not set");
            return;
        }
        btag = "NymN#1716"; // hardcoding battletag for now because config returns lowercase data somehow
        this.getOverwatchStatsFor(channel, username, prefix, btag)
    }

    getOverwatchStatsFor(channel, username, prefix, btag)
    {
        if (btag.indexOf("#") < 0) {
            return;
        }
        btag = btag.replace("#", "-")
        var url = `https://api.lootbox.eu/pc/eu/${btag}/profile`
        console.log(`[OW] getting stats for ${btag}`)
        request(url, (error, response, body) => {
			console.log('[GET] ' + url);
			try {
                if (!error && response.statusCode == 200) {
    				var json = JSON.parse(body.toString());
                    if (json.statusCode === 404) {
                        console.log(json);
                        return;
                    }
                    var btagshort = btag.split("-")[0]
    				this.bot.say(channel, `${prefix}${btagshort} is level ${json.data.level} | won: ${json.data.games.wins} | lost: ${json.data.games.lost} | win/loss ${json.data.games.win_percentage}%`);
                }
            } catch (err) {
                console.log(err);
            }
		});
    }
}
