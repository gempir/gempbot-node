
var socket = io.connect('46.101.195.112:3000');

socket.on('startSkip', function(data) {
	var channel = data.channel.substr(1);
	showData('A voting has been started type <span class="red">!vote skip</span> or <span class="green">!vote stay</span> to vote on the current content.  <br> The voting ends in 45 seconds', channel)
});

socket.on('startRate', function(data) {
	var channel = data.channel.substr(1);
	showData('A rate voting has been started type E.g. <span class="yellow">[ !vote 5 ]</span> to rate the current content. The voting ends in 45 seconds.', channel)
});

socket.on('resultsSkip', function(data) {
	var channel = data.channel.substr(1);
	showData('<span class="red">skip: ' + data.skip + '</span><br><span class="green"> stay: ' + data.stay + '</span><br>votes: ' + (data.skip+data.stay), channel);
});

socket.on('resultsRate', function(data) {
	var channel = data.channel.substr(1);
	showData('<span class="yellow"> average rating: ' + data.avgRating  + '</span><br>votes: ' + data.votes, channel);
});


function showData(data, channel)
{
	$('.popup.' + channel).html(data).animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});
	setTimeout(function() {
		$('.popup').animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});
	}, 20000);
}
