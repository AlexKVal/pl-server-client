var express = require('express');
var morgan = require('morgan')
var todosAPI = require('./apps/todosAPI');
var bbApp = require('./apps/bbApp')
var app = express();


app.use(morgan('dev'));
app.set('view engine', 'jade');

app.use('/jq', express.static('clients/jq'));

app.use('/todos', todosAPI);

app.use('/b', bbApp);


function statusNameToLowerCase(req, res, next) {
  req.params.status_name = req.params.status_name.toLowerCase();
  next();
}
app.param('status_name', statusNameToLowerCase);
app.get('/status/:status_name', function (req, res) {
  var filteredList = todos.filter(function statusFilter(el) {
    return el.status === req.params.status_name;
  })

  if (filteredList.length === 0) {
    res.status(404).json('Nothing has been found with status = ' + req.params.status_name);
  } else {
    res.json(filteredList);
  }
});

app.get('/redir', function (req, res) {
  res.redirect(301, '/todos');
});

app.param(['user_id'], function (req, res, next, user_id) {
  console.log('app.param() user_id: ', user_id);
  req.user = {id: user_id};
  next();
})

app.get('/u/:id', function (req, res) {
  console.log('in app.get(): id: ', req.user.id);
  res.send('Hello from u');
})


app.get('/user/:user_id', function (req, res) {
  console.log('in app.get(): user_id: ', req.user.id);
  res.send('Hello from user');
})

app.listen(3000);

// console.log(app.settings);
