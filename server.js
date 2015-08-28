var express = require('express');
var morgan = require('morgan')
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();

app.use(morgan('dev'));

app.use('/b', express.static('backbone'));
app.use('/jq', express.static('jq'));



var todos = [
  {id: 1, description: 'Pick up milk.', status: 'incomplete'},
  {id: 2, description: 'Get a car wash', status: 'complete'},
  {id: 3, description: 'Learn Backbone.', status: 'incomplete'}
];
var nextId = 4;
// GET /todos
app.get('/todos', function (req, res) {
  if (req.query.limit >= 0) {
    res.json(todos.slice(0, req.query.limit));
  } else {
    res.json(todos);
  }
});
// POST /todos
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/todos', jsonParser, urlencodedParser, function (req, res) {
  var formData = req.body;

  var newTodo = {
    id: nextId++,
    description: formData.description,
    status: formData.status === 'on' ? 'complete' : 'incomplete'
  }
  todos.push(newTodo);

  res.status(201).json(newTodo); // 201 Created
})
// DELETE /todos
app.param('id', function (req, res, next, id) {
  req.id = parseInt(id, 10);
  next();
})
app.delete('/todos/:id', function (req, res) {
  _.remove(todos, 'id', req.id);
  res.sendStatus(200);
})




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
