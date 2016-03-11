var irc     = require('./../controllers/irc');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./../controllers/functions');


var votings = {};
var activeVotings = [];


function startVoting(channel, username, message) {
	votings[channel] = {};

	if (activeVotings.indexOf(channel) > -1) {
		return false;
	}
	if (message.toLowerCase() === '!voting') {
		irc.whisper(username, 'No voting option specified try [ !voting skip ]');
		return false;
	}
	if (message.toLowerCase() === '!voting rate') {
		overlay.emit(channel.substr(1) + ':startRate',{ channel: channel});
		activeVotings.push(channel);
		votings[channel]['votesRatings'] = [];
		votings[channel]['voters'] = [];
		votingRateController(channel, username, message);
	}
	if (message.toLowerCase() === '!voting skip') {
		overlay.emit(channel.substr(1) + ':startSkip',{ channel: channel});
		activeVotings.push(channel);
		votings[channel]['voters'] = [];
		votings[channel]['votesSkipStay']  = { skip: 0, stay: 0};
		votingSkipController(channel, username, message);
	}
	else {
		return false;
	}

}

function voteCommandHandler(channel, username, message)
{
	if (typeof votings[channel] === 'undefined') {
		return false;
	}
	if (message.toLowerCase() === '!vote' || votings[channel]['voters'].indexOf(username) > -1) {
		return false;
	}
	votingSkip(channel, username, message);
}

function votingSkip(channel, username, message) {

	var regex = '(!)(vote)(\\s+)([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';
	var regex2 = '(!)(vote)(\\s+)([+-]?\\d*\\,\\d+)(?![-+0-9\\.])';
	var regex3 = '(!)(vote)(\\s+)(\\d+)';

	if (message.toLowerCase() == '!vote stay') {
		if (votings[channel]['voters'].indexOf(username) > -1) {
			return false;
		}
		votings[channel]['votesSkipStay']['stay'] += 1;
		votings[channel]['voters'].push(username);

	}
	else if (message.toLowerCase() == '!vote skip') {
		votings[channel]['votesSkipStay']['skip'] += 1;
		votings[channel]['voters'].push(username);
	}
	else if (!(message.toLowerCase().match(regex)) === null || !(message.toLowerCase().match(regex2) === null) || !(message.toLowerCase().match(regex3) === null)) {
		var voteValue = fn.getNthWord(message, 2).replace(',','.');
		if (voteValue <= 10 && voteValue > 0) {
			votings[channel]['voters'].push(username);
			votings[channel]['votesRatings'].push(voteValue);
		}
	}
}

function votingSkipController(channel, username, message) {
	irc.say(channel, 'A skip or stay voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content. The voting ends in 45 seconds ');

	setTimeout(function(){
		fn.removeFromArray(activeVotings, channel);
		var totalVotes = Number(votings[channel]['votesSkipStay']['stay']) + Number( votings[channel]['votesSkipStay']['skip']);
		overlay.emit(channel.substr(1) + ':resultsSkip', { stay: votings[channel]['votesSkipStay']['stay'], skip: votings[channel]['votesSkipStay']['skip'], channel: channel});
		irc.say(channel, '@' + username + ', The voting ended, skip: [ ' +  votings[channel]['votesSkipStay']['skip'] + ' ] | stay: [ ' +  votings[channel]['votesSkipStay']['stay'] + ' ] | votes: [ ' + totalVotes + ' ]');
	}, 45000);
}

function votingRateController(channel, username, message) {
	irc.say(channel, 'A rating voting has been started type E.g. [ !vote 5 ] to rate the current content. The voting ends in 45 seconds.');

	setTimeout(function(){
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
			rating = Number(votings[channel]['votesRatings'][i]);
			if (rating < avgRating * 0.25) {
				continue;
			}
			totalRatings += rating;
			count++;
		}
		avgRating = (totalRatings / count).toFixed(1);

		fn.removeFromArray(activeVotings, channel);
		irc.say(channel, '@' + username + ', The voting ended, the average ratings is: [ ' + avgRating + ' ] | votes: [ ' + votings[channel]['votesRatings'].length + ' ]' + ' raw rating: [' + avgRatingsRaw + ']');
		overlay.emit(channel.substr(1) + ':resultsRate', { avgRating: avgRating, votes: votings[channel]['votesRatings'].length, channel: channel });
	}, 45000);
}

module.exports =
{
	startVoting,
	voteCommandHandler
}
