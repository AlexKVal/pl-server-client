var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var router = express.Router();

var todos = [
  {id: 1, description: 'Pick up milk.', status: 'incomplete'},
  {id: 2, description: 'Get a car wash', status: 'complete'},
  {id: 3, description: 'Learn Backbone.', status: 'incomplete'}
];
var nextId = 4;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.param('id', function (req, res, next, id) {
  req.id = parseInt(id, 10);
  next();
})

router.route('/')
  .get(function (req, res) {
    if (req.query.limit >= 0) {
      res.json(todos.slice(0, req.query.limit));
    } else {
      res.json(todos);
    }
  })
  .post(jsonParser, urlencodedParser, function (req, res) {
    var formData = req.body;

    var newTodo = {
      id: nextId++,
      description: formData.description,
      status: formData.status === 'on' ? 'complete' : 'incomplete'
    }
    todos.push(newTodo);

    res.status(201).json(newTodo); // 201 Created
  })

router.route('/:id')
  .get(function (req, res) {
    var foundTodoItem = _.find(todos, 'id', req.id);
    if (foundTodoItem) res.json(foundTodoItem);
    else res.status(404).json('There is no todo entry with id = ' + req.id);
  })
  .delete(function (req, res) {
    _.remove(todos, 'id', req.id);
    res.sendStatus(204);
  })
  .put(jsonParser, urlencodedParser, function (req, res) {
    var foundTodoItem = _.find(todos, 'id', req.id);
    if (!foundTodoItem) res.status(404).json('There is no todo entry with id = ' + req.id);

    var formData = req.body;
    foundTodoItem.description = formData.description;
    foundTodoItem.status = formData.status === 'on' ? 'complete' : 'incomplete';

    res.status(204).json(foundTodoItem);
  })

module.exports = router;
