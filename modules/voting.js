var output = require('./../connection/output');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./functions');

function startVoting(channel, username, message) {
	global.votes  = [0,0];

	if (message.toLowerCase() === '!voting') {
		output.whisper(username, 'No voting option specified try [ !voting skip ]');
		return false;
	}
	if (message.toLowerCase() === '!voting rate') {
		overlay.emit('startRate',{});
		global.voting = true;
		global.ratings  = [];
		global.voters = [];
		votingRateController(channel, username, message);
	}
	if (message.toLowerCase() === '!voting skip') {
		global.voting = true;
		global.voters = [];
		overlay.emit('startSkip',{});
		votingSkipController(channel, username, message);
	}
	else {
		return false;
	}

}

function voteCommandHandler(channel, username, message)
{
	if (message.toLowerCase() === '!vote') {
		return false; // make sure an option is set
	}
	votingSkip(channel, username, message);
}

function votingSkip(channel, username, message) {

	var regex = '(!)(vote)(\\s+)([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';
	var regex2 = '(!)(vote)(\\s+)([+-]?\\d*\\,\\d+)(?![-+0-9\\.])';
	var regex3 = '(!)(vote)(\\s+)(\\d+)';

	if (message.toLowerCase() == '!vote stay') {
		if (global.voters.indexOf(username) > -1) {
			return false;
		}
		global.votes[1] += 1;
		global.voters.push(username)

	}
	else if (message.toLowerCase() == '!vote skip') {
		if (global.voters.indexOf(username) > -1) {
			return false;
		}
		global.votes[0] += 1;
		global.voters.push(username)
	}
	else if (!(message.toLowerCase().match(regex)) === null || !(message.toLowerCase().match(regex2) === null) || !(message.toLowerCase().match(regex3) === null)) {
		if (global.voters.indexOf(username) > -1) {
			return false;
		}

		var voteValue = fn.getNthWord(message, 2).replace(',','.');
		if (voteValue <= 10 && voteValue > 0) {
			global.voters.push(username);
			global.ratings.push(voteValue);
		}
	}
}

function votingSkipController(channel, username, message) {
	output.sayNoCD(channel, 'A skip or stay voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content. The voting ends in 45 seconds ');

	setTimeout(function(){
		console.log(global.votes[0], global.votes[1]);
		overlay.emit('resultsSkip', { stay: global.votes[1], skip: global.votes[0]});
		var totalVotes = Number(global.votes[0]) + Number(global.votes[1]);
		global.voting = false;
		output.sayNoCD(channel, '@' + username + ', The voting ended, skip: [ ' + global.votes[0] + ' ] | stay: [ ' + global.votes[1] + ' ] | votes: [ ' + totalVotes + ' ]');
	}, 45000);
}

function votingRateController(channel, username, message) {
	output.sayNoCD(channel, 'A rating voting has been started type E.g. [ !vote 5 ] to rate the current content. The voting ends in 45 seconds.');

	setTimeout(function(){
		var totalRatings = 0;
		for (var i = 0; i < global.ratings.length; i++) {
			totalRatings += Number(global.ratings[i]);
		}
		var avgRating = (totalRatings / global.ratings.length).toFixed(1);
		global.voting = false;
		output.sayNoCD(channel, '@' + username + ', The voting ended, the average ratings is: [ ' + avgRating + ' ] | votes: [ ' + global.ratings.length + ' ]');
		overlay.emit('resultsRate', { avgRating: avgRating, votes: global.ratings.length });
	}, 45000);
}

module.exports =
{
	startVoting,
	voteCommandHandler
}
