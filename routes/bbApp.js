var express = require('express');
var _ = require('lodash');
var todos = require('../bbApp/data');

var router = express.Router();

router.use('/', express.static('bbApp'));

router.get('/', function (req, res) {
  var filteredTodos = _.filter(todos, function (item) {
    return item.status === 'incomplete';
  })
  res.render('bbApp', {todos: JSON.stringify(filteredTodos, null , 2)});
})

module.exports = router;
