var output = require('./twitch/output');


function startVoting(channel, user, message) {
	global.skip = 0;
	global.stay = 0;
	global.voters = [];
	global.voting = true;
	output.sayNoCD(channel, 'A voting has been started type [ !skip ] or [ !stay ] to vote on the current content. The voting is over after 30 seconds ');

	setTimeout(function(){
		output.sayNoCD(channel, 'The voting ended, skip: [ ' + global.skip + ' ] | stay: [ ' + global.stay + ' ] | votes: [ ' + global.voters.length + ' ]');
		global.voting = false;
	}, 30000);
}


function countVotes(channel, user, message) {
	if (!global.voting) {
		return false;
	}
	if (message.toLowerCase().substr(0,5) === '!skip') {
		if (global.voters.indexOf(user.username) > -1) {
			return false;
		}
		global.skip += 1;
		global.voters.push(user.username)
		console.log('[VOTE] skip ' + global.skip, global.voters);
	}
	if (message.toLowerCase().substr(0,5) === '!stay') {
		if (global.voters.indexOf(user.username) > -1) {
			return false;
		}
		global.stay += 1;
		global.voters.push(user.username)
		console.log('[VOTE] stay ' + global.stay, global.voters);
	}
}

module.exports = 
{
	startVoting,
	countVotes
}