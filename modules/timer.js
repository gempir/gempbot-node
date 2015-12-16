var output = require('./twitch/output');
var fn     = require('./functions');

function setTimer(channel, username, message)
{
	if (message.toLowerCase() === '!timer') {
		return false; // ensure a time is given
	}

	var givenTime = fn.getNthWord(message, 2);
	var timerMessage = fn.getNthWord(message, 3);

	startTimer(username, givenTime, timerMessage);
}


function startTimer(username, givenTime, timerMessage)
{
	console.log(givenTime);
	output.whisper(username, 'timer set: ' + timerMessage + ' in ' + givenTime + ' seconds');
	setTimeout(function() {
		output.whisper(username, 'You\'re timer is up: ' + timerMessage + ' (' + givenTime + 's)'); 
	}, givenTime * 1000);

}

module.exports =
{
	setTimer
}