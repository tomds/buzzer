var express = require('express');
var engines = require('consolidate');
var http = require('http');
var db = require('mongojs').connect('quiz', ['quiz']);
var io = require('socket.io');
var clientConnection = require('./clientConnection');

var app = express();
var server = http.createServer(app);
io = io.listen(server);
server.listen(3000);

app.engine('html', engines.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/host', function (req, res) {
    res.render('index', {host: true});
});

io.sockets.on('connection', function (socket) {
    clientConnection.init(socket);
});