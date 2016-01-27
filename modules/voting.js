var output = require('./../connection/output');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./functions');

var voting = false;
var votesSkipStay = {};
var votesRatings = [];
var voters = [];

function startVoting(channel, username, message) {
	votesSkipStay  = { skip: 0, stay: 0};

	if (message.toLowerCase() === '!voting') {
		output.whisper(username, 'No voting option specified try [ !voting skip ]');
		return false;
	}
	if (message.toLowerCase() === '!voting rate') {
		overlay.emit('startRate',{});
		voting = true;
		votesRatings  = [];
		voters = [];
		votingRateController(channel, username, message);
	}
	if (message.toLowerCase() === '!voting skip') {
		voting = true;
		voters = [];
		overlay.emit('startSkip',{});
		votingSkipController(channel, username, message);
	}
	else {
		return false;
	}

}

function voteCommandHandler(channel, username, message)
{
	if (message.toLowerCase() === '!vote' || !voting) {
		return false; // make sure an option is set
	}
	votingSkip(channel, username, message);
}

function votingSkip(channel, username, message) {

	var regex = '(!)(vote)(\\s+)([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';
	var regex2 = '(!)(vote)(\\s+)([+-]?\\d*\\,\\d+)(?![-+0-9\\.])';
	var regex3 = '(!)(vote)(\\s+)(\\d+)';

	if (message.toLowerCase() == '!vote stay') {
		if (voters.indexOf(username) > -1) {
			return false;
		}
		votesSkipStay.stay += 1;
		voters.push(username)

	}
	else if (message.toLowerCase() == '!vote skip') {
		if (voters.indexOf(username) > -1) {
			return false;
		}
		votesSkipStay.skip += 1;
		voters.push(username)
	}
	else if (!(message.toLowerCase().match(regex)) === null || !(message.toLowerCase().match(regex2) === null) || !(message.toLowerCase().match(regex3) === null)) {
		if (voters.indexOf(username) > -1) {
			return false;
		}

		var voteValue = fn.getNthWord(message, 2).replace(',','.');
		if (voteValue <= 10 && voteValue > 0) {
			voters.push(username);
			votesRatings.push(voteValue);
		}
	}
}

function votingSkipController(channel, username, message) {
	output.sayNoCD(channel, 'A skip or stay voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content. The voting ends in 45 seconds ');

	setTimeout(function(){
		overlay.emit('resultsSkip', { stay: votesSkipStay.stay, skip: votesSkipStay.skip});
		var totalVotes = Number(votesSkipStay.stay) + Number(votesSkipStay.skip);
		voting = false;
		output.sayNoCD(channel, '@' + username + ', The voting ended, skip: [ ' + votesSkipStay.skip + ' ] | stay: [ ' + votesSkipStay.stay + ' ] | votes: [ ' + totalVotes + ' ]');
	}, 45000);
}

function votingRateController(channel, username, message) {
	output.sayNoCD(channel, 'A rating voting has been started type E.g. [ !vote 5 ] to rate the current content. The voting ends in 45 seconds.');

	setTimeout(function(){
		var totalRatings = 0;
		for (var i = 0; i < votesRatings.length; i++) {
			totalRatings += Number(votesRatings[i]);
		}
		var avgRating = (totalRatings / votesRatings.length).toFixed(1);
		voting = false;
		output.sayNoCD(channel, '@' + username + ', The voting ended, the average ratings is: [ ' + avgRating + ' ] | votes: [ ' + votesRatings.length + ' ]');
		overlay.emit('resultsRate', { avgRating: avgRating, votes: votesRatings.length });
	}, 45000);
}

module.exports =
{
	startVoting,
	voteCommandHandler
}
