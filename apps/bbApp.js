var express = require('express');
var _ = require('lodash');
var todos = require('../data/data');

var router = express.Router();

router.use('/', express.static('clients/bbApp'));
router.use('/', express.static('clients/css'));

router.get('/', function (req, res) {
  // var filteredTodos = _.filter(todos, function (item) {
  //   return item.status === 'incomplete';
  // })
  // res.render('bbApp/index', {todos: JSON.stringify(filteredTodos, null , 2)});
  res.render('bbApp/index', {todos: JSON.stringify(todos, null , 2)});
})

module.exports = router;
