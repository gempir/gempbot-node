
var socket = io.connect();

socket.on('startSkip', function() {
	showData('A voting has been started type <span class="red">!vote skip</span> or <span class="green">!vote stay</span> to vote on the current content.  <br> The voting ends in 45 seconds')
});

socket.on('startRate', function() {
	showData('A rate voting has been started type E.g. <span class="yellow">[ !vote 5 ]</span> to rate the current content. The voting ends in 45 seconds.')
});

socket.on('resultsSkip', function(data) {
	showData('<span class="red">skip: ' + data.skip + '</span><br><span class="green"> stay: ' + data.stay + '</span><br>votes: ' + (data.skip+data.stay));
});

socket.on('resultsRate', function(data) {
	showData('<span class="yellow"> average rating: ' + data.avgRating  + '</span><br>votes: ' + data.votes);
});


function showData(data)
{
	$('.popup').html(data).animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});
	setTimeout(function() {
		$('.popup').animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});
	}, 20000);
}
