var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var morgan = require('morgan');
var todosAPI = require('./apps/todosAPI');
var bbApp = require('./apps/bbApp');
var marApp = require('./apps/marApp');

var app = express();
var httpServer = http.createServer(app);
var ioServer = socketio(httpServer);
var todosAPIRouter = todosAPI(ioServer);

app.set('view engine', 'jade');

app.use(morgan('dev'));

app.use('/todos', todosAPIRouter);

app.use('/jq', express.static('clients/jq'));

app.use('/b', bbApp);

app.use('/m', marApp);

httpServer.listen(3000);
