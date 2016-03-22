var net = require('net');
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});
console.log('[express] connected on port 3000');
var io = require('socket.io').listen(server);

app.set('view engine', 'jade');
app.set('views', (__dirname +'/views'));
app.use(express.static(__dirname + '/public'));


app.get('/*', function (req, res) {
  res.render('index', { req: req.path.substr(1) });
});



function emit(event, data)
{
  console.log('emit: ' + JSON.stringify(data));
  io.emit(event, data);
}

module.exports =
{
  emit
}
