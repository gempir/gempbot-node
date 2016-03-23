
var socket = io.connect();

var currentURL = window.location.href;

function getUrlParts(url) {
    var a = document.createElement('a');
    a.href = url;

    return {
        href: a.href,
        host: a.host,
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname,
        protocol: a.protocol,
        hash: a.hash,
        search: a.search
    };
}

var channelByURL = (getUrlParts(currentURL).pathname).substr(1);

socket.on(channelByURL + ':startSkip', function(data) {
	var channel = data.channel.substr(1);
	showData('A voting has been started type <span class="red">!vote skip</span> or <span class="green">!vote stay</span> to vote on the current content', channel)
});

socket.on(channelByURL + ':startRate', function(data) {

	var channel = data.channel.substr(1);
	showData('A rate voting has been started type E.g. <span class="yellow">[ !vote 5 ]</span> to rate the current content', channel)
});

socket.on(channelByURL + ':resultsSkip', function(data) {
	var channel = data.channel.substr(1);
	showData('<span class="red">skip: ' + data.skip + '</span><br><span class="green"> stay: ' + data.stay + '</span><br>votes: ' + (data.skip+data.stay), channel);
});

socket.on(channelByURL + ':resultsRate', function(data) {
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
