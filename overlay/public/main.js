$(document).ready(function(){
	var socket = io.connect('46.101.195.112:3000');
	socket.on('votes', function (data) {
	if (data.indexOf('startSkip') > -1) {
	  var text = 'A voting has been started type <span class="skip">!vote skip</span> or <span class="stay">!vote stay</span> to vote on the current content.  <br> The voting is over after 45 seconds';
	}
	else if (data.indexOf('startRate') > -1) {
	  var text = 'A rating voting has been started type <span class="rate">[ !vote 5 ]</span> (number from 0-10 with decimals) to rate the current content. The voting ends in 45 seconds.';
	}
	else if (data.indexOf('resultsRate') > -1) {
	  data = data.replace('resultsRate','');
	  ratings = data.split(',');
	  var text = '<span class="rate"> average rating: ' + ratings[0] + '</span><br>votes: ' + ratings[1];
	}
	else if (data.indexOf('resultsSkip') > -1 ) {
	  data = data.replace('resultsSkip','');
	  var votes = data.split(',');
	  var totalVotes = Number(votes[0]) + Number(votes[1]);
	  var text = '<span class="skip"> skip: ' + votes[0] + '</span><br><span class="stay">stay: ' + votes[1] + '</span><br>votes: ' + totalVotes;
	}

	$('.popup').html(text).animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});

	setTimeout(function() {
	  $('.popup').animate({width: [ "toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle"});
  	}, 25000);

	});
});
