var express = require('express');
var morgan = require('morgan');
var todosAPI = require('./apps/todosAPI');
var bbApp = require('./apps/bbApp');
var marApp = require('./apps/marApp');
var app = express();

app.set('view engine', 'jade');

app.use(morgan('dev'));

app.use('/todos', todosAPI);

app.use('/jq', express.static('clients/jq'));

app.use('/b', bbApp);

app.use('/m', marApp);

app.listen(3000);
