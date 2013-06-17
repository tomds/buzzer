var express = require('express');
var engines = require('consolidate');

var app = express();

app.engine('html', engines.hogan);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(3000);