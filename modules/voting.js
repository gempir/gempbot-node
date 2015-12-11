var output = require('./twitch/output');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./functions');

function startVoting(channel, user, message) {
	if (message.toLowerCase() === '!voting') {
		output.whisper(user.username, 'No voting option specified try [ !voting skip ]');
		return false;
	}
	if (message.toLowerCase() === '!voting skip') {
		global.votingOption = 'skip';
		overlay.emit('skip');
	}
	global.votes  = [0,0];
	global.voters = [];
	global.voting = true;
	output.sayNoCD(channel, 'A voting has been started type [ !vote skip ] or [ !vote stay ] to vote on the current content. The voting is over after 45 seconds ');
	
	setTimeout(function(){
		global.voting = false;
		overlay.emit(global.votes[0] + ',' + global.votes[1]);
		var totalVotes = Number(global.votes[0]) + Number(global.votes[1]);
		output.sayNoCD(channel, '@' + user.username + ', The voting ended, skip: [ ' + global.votes[0] + ' ] | stay: [ ' + global.votes[0] + ' ] | votes: [ ' + totalVotes + ' ]');
	}, 45000);
}

function voteCommandHandler(channel, user, message) 
{
	if (message.toLowerCase() === '!vote') {
		return false; // make sure an option is set
	}
	var option = fn.getNthWord(message.toLowerCase(), 2);
	console.log(option);

	switch (option) {
		case 'skip':
			votingSkip(channel, user, message);
			break;
	}
}

function votingSkip(channel, user, message) {
	if (message.toLowerCase() === '!vote stay') {
		if (global.voters.indexOf(user.username) > -1) {
			return false;
		}
		global.votes[1] += 1;
		global.voters.push(user.username)
		
	}
	if (message.toLowerCase() === '!vote skip') {
		if (global.voters.indexOf(user.username) > -1) {
			return false;
		}
		global.votes[0] += 1;
		global.voters.push(user.username)
	}
}

module.exports = 
{
	startVoting,
	voteCommandHandler
}