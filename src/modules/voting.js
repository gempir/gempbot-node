var irc     = require('./../controllers/irc');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./../controllers/functions');


var votings = {};
var activeVotings = [];


export default class Voting {
	constructor(bot) {
		this.bot = bot;
	}

	startVoting(channel, username, arg, prefix)
	{
		votings[channel] = {};
		console.log(channel, username, arg)
		if (activeVotings.indexOf(channel) > -1) {
			return false;
		}

		if (arg === 'rate') {
			overlay.emit(channel.substr(1) + ':startRate',{ channel: channel});
			activeVotings.push(channel);
			votings[channel]['votesRatings'] = [];
			votings[channel]['voters'] = [];
			this.votingRateController(channel, username, prefix);
		}
		if (arg === 'skip') {
			overlay.emit(channel.substr(1) + ':startSkip',{ channel: channel});
			activeVotings.push(channel);
			votings[channel]['voters'] = [];
			votings[channel]['votesSkipStay']  = { skip: 0, stay: 0};
			this.votingSkipController(channel, username, prefix);
		}
		else {
			return false;
		}

	}

	vote(channel, username, arg)
	{
		if (typeof votings[channel] === 'undefined') {
			return false;
		}

		var regex = '([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';
		var regex2 = '([+-]?\\d*\\,\\d+)(?![-+0-9\\.])';
		var regex3 = '(\\d+)';

		if (arg.toLowerCase() === 'stay') {
			if (votings[channel]['voters'].indexOf(username) > -1) {
				return false;
			}
			votings[channel]['votesSkipStay']['stay'] += 1;
			votings[channel]['voters'].push(username);
		}
		else if (arg.toLowerCase() === 'skip') {
			votings[channel]['votesSkipStay']['skip'] += 1;
			votings[channel]['voters'].push(username);
		}
		else if (!(arg.toLowerCase().match(regex)) === null || !(arg.toLowerCase().match(regex2) === null) || !(arg.toLowerCase().match(regex3) === null)) {
			var voteValue = arg.replace(',','.');
			if (voteValue <= 10 && voteValue > 0) {
				votings[channel]['voters'].push(username);
				votings[channel]['votesRatings'].push(voteValue);
			}
		}
	}

	votingSkipController(channel, username, prefix) {
		this.bot.say(channel, prefix + 'a skip or stay voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content (45s)');

		setTimeout(() => {
			fn.removeFromArray(activeVotings, channel);
			var totalVotes = Number(votings[channel]['votesSkipStay']['stay']) + Number( votings[channel]['votesSkipStay']['skip']);
			overlay.emit(channel.substr(1) + ':resultsSkip', { stay: votings[channel]['votesSkipStay']['stay'], skip: votings[channel]['votesSkipStay']['skip'], channel: channel});
			this.bot.say(channel, prefix + 'the voting ended, skip: [ ' +  votings[channel]['votesSkipStay']['skip'] + ' ] | stay: [ ' +  votings[channel]['votesSkipStay']['stay'] + ' ] | votes: [ ' + totalVotes + ' ]');
		}, 45000);
	}

	votingRateController(channel, username, prefix) {
		this.bot.say(channel, prefix + 'a rating voting has been started type E.g. [ !vote 5 ] to rate the current content (45s)');

		setTimeout(() => {
			var totalRatings = 0;
			for (var i = 0; i < votings[channel]['votesRatings'].length; i++) {
				totalRatings += Number(votings[channel]['votesRatings'][i]);
			}
			var avgRating = (totalRatings / votings[channel]['votesRatings'].length).toFixed(1);
			var avgRatingsRaw = avgRating;
			console.log('pre-weighted-algorithm: ' + avgRating);
			totalRatings = 0;
			var count    = 0;
			for (var i = 0; i < votings[channel]['votesRatings'].length; i++) {
				var rating = Number(votings[channel]['votesRatings'][i]);
				if (rating < avgRating * 0.25) {
					continue;
				}
				totalRatings += rating;
				count++;
			}
			avgRating = (totalRatings / count).toFixed(1);

			fn.removeFromArray(activeVotings, channel);
			this.bot.say(channel, prefix + 'the voting ended, the average ratings is: [ ' + avgRating + ' ] | votes: [ ' + votings[channel]['votesRatings'].length + ' ]' + ' raw rating: [' + avgRatingsRaw + ']');
			overlay.emit(channel.substr(1) + ':resultsRate', { avgRating: avgRating, votes: votings[channel]['votesRatings'].length, channel: channel });
		}, 45000);
	}

}
