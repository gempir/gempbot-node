var net = require('net');
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});

console.log('[express] connected on port 3000');
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


function emit(event, data)
{
  console.log('emit:' + data);
  io.emit(event, data);
}

module.exports =
{
  emit
}
