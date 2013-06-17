var express = require('express');
var engines = require('consolidate');

var app = express();

app.engine('html', engines.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index', {title: 'test'});
});

app.listen(3000);