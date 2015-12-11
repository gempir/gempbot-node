var net = require('net');
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});

console.log('connect on port 3000');
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function emit(data)
{
  console.log('emit:' + data);
  io.emit('votes', data);
}

module.exports = 
{
  emit
}


