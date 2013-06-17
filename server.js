var express = require('express');
var engines = require('consolidate');
var db = require('mongojs').connect('quiz', ['quiz']);
var q = require('q');

var app = express();

app.engine('html', engines.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function(req, res) {
    
    res.render('index');
});

app.listen(3000);