var overlay = require('./../overlay/overlay');
var lib 	= require('./../lib');

var votings = {};
var activeVotings = [];


export default class Voting {
	constructor(bot) {
		this.bot           = bot;
		this.votings 	   = {};
		this.activeVotings = [];
	}

	startVoting(channel, username, arg, prefix)
	{
		this.votings[channel] = {};
		if (this.activeVotings.indexOf(channel) > -1) {
			return;
		}
		if (arg === 'rate') {
			overlay.emit(`${channel.substr(1)}:startRate`,{ channel: channel});
			this.activeVotings.push(channel);
			this.votings[channel]['votesRatings'] = [];
			this.votings[channel]['voters'] = [];
			this.votingRateController(channel, username, prefix);
		}
		if (arg === 'skip') {
			overlay.emit(channel.substr(1) + ':startSkip',{ channel: channel});
			this.activeVotings.push(channel);
			this.votings[channel]['voters'] = [];
			this.votings[channel]['votesSkipStay']  = { skip: 0, stay: 0};
			this.votingSkipController(channel, username, prefix);
		}
		else {
			return;
		}

	}

	vote(channel, username, arg)
	{
		if (this.activeVotings.indexOf(channel) < 0) {
			return;
		}
		try {
			var regex = '([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';
			var regex2 = '([+-]?\\d*\\,\\d+)(?![-+0-9\\.])';
			var regex3 = '(\\d+)';

			if (arg.toLowerCase() === 'stay') {
				if (this.votings[channel]['voters'].indexOf(username) > -1) {
					return false;
				}
				this.votings[channel]['votesSkipStay']['stay'] += 1;
				this.votings[channel]['voters'].push(username);
			}
			else if (arg.toLowerCase() === 'skip') {
				this.votings[channel]['votesSkipStay']['skip'] += 1;
				this.votings[channel]['voters'].push(username);
			}
			else if (!(arg.toLowerCase().match(regex)) === null || !(arg.toLowerCase().match(regex2) === null) || !(arg.toLowerCase().match(regex3) === null)) {
				var voteValue = arg.replace(',','.');
				if (voteValue <= 10 && voteValue > 0) {
					this.votings[channel]['voters'].push(username);
					this.votings[channel]['votesRatings'].push(voteValue);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	votingSkipController(channel, username, prefix) {
		this.bot.say(channel, `${prefix} a skip or stay voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content (45s)`);

		setTimeout(() => {
			lib.removeFromArray(this.activeVotings, channel);
			var totalVotes = Number(this.votings[channel]['votesSkipStay']['stay']) + Number(this.votings[channel]['votesSkipStay']['skip']);
			overlay.emit(`${channel.substr(1)}:resultsSkip`, { stay: this.votings[channel]['votesSkipStay']['stay'], skip: this.votings[channel]['votesSkipStay']['skip'], channel: channel});
			this.bot.say(channel, `${prefix}the voting ended, skip: [${this.votings[channel]['votesSkipStay']['skip']}] | stay: [${this.votings[channel]['votesSkipStay']['stay']}] | votes: [${totalVotes}]`);
		}, 45000);
	}

	votingRateController(channel, username, prefix) {
		this.bot.say(channel, prefix + 'a rating voting has been started type E.g. [ !vote 5 ] to rate the current content (45s)');

		setTimeout(() => {
			var totalRatings = 0;
			for (var i = 0; i < this.votings[channel]['votesRatings'].length; i++) {
				totalRatings += Number(this.votings[channel]['votesRatings'][i]);
			}
			var avgRating = (totalRatings / this.votings[channel]['votesRatings'].length).toFixed(1);
			var avgRatingsRaw = avgRating;
			console.log(`pre-weighted-algorithm: ${avgRating}`);
			totalRatings = 0;
			var count    = 0;
			for (var i = 0; i < this.votings[channel]['votesRatings'].length; i++) {
				var rating = Number(this.votings[channel]['votesRatings'][i]);
				if (rating < avgRating * 0.25) {
					continue;
				}
				totalRatings += rating;
				count++;
			}
			avgRating = (totalRatings / count).toFixed(1);

			lib.removeFromArray(this.activeVotings, channel);
			overlay.emit(`${channel.substr(1)}:resultsRate`, { avgRating: avgRating, votes: this.votings[channel]['votesRatings'].length, channel: channel });
			this.bot.say(channel, `${prefix}the voting ended, the average ratings is: [${avgRating}] | votes: [${this.votings[channel]['votesRatings'].length}] | raw rating: [${avgRatingsRaw}]`);
		}, 45000);
	}

}
