var express = require('express');
var app = express();

var todos = [
  {id: 1, description: 'Pick up milk.', status: 'incomplete'},
  {id: 2, description: 'Get a car wash', status: 'incomplete'},
  {id: 3, description: 'Learn Backbone.', status: 'incomplete'}
];

app.use('/b', express.static('backbone'));

app.use('/jq', express.static('jq'));

app.get('/todos', function (req, res) {
  res.json(todos);
});

app.get('/redir', function (req, res) {
  res.redirect(301, '/todos');
});

app.param(['user_id', 'id'], function (req, res, next, user_id) {
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

console.log(app.settings);
