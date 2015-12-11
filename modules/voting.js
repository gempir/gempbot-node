var output = require('./twitch/output');
var overlay = require('./../overlay/overlay');
var fn 	    = require('./functions');

function startVoting(channel, user, message) {
	if (message.toLowerCase() === '!voting') {
		output.whisper(user.username, 'No voting option specified try [ !voting rate ] or [ !voting skip ]');
		return false;
	}
	if (message.toLowerCase() === '!voting skip') {
		global.votingOption = 'skip';
		overlay.emit('skip');
	}
	global.votes  = [0,0];
	global.voters = [];
	global.voting = true;
	output.sayNoCD(channel, 'A voting has been started.');
	
	setTimeout(function(){
		global.voting = false;
		output.sayNoCD(channel, 'voting ended');
		overlay.emit(global.votes[0] + ',' + global.votes[1]);
	}, 10000);
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
		global.votes[0] += 1;
		global.voters.push(user.username)
		
	}
	if (message.toLowerCase() === '!vote skip') {
		if (global.voters.indexOf(user.username) > -1) {
			return false;
		}
		global.votes[1] += 1;
		global.voters.push(user.username)
	}
}

module.exports = 
{
	startVoting,
	voteCommandHandler
}