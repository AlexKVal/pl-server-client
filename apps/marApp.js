var express = require('express');
var _ = require('lodash');
var todos = require('../data/data');

var router = express.Router();

router.use('/', express.static('clients/marionette'));
router.use('/', express.static('clients/css'));

router.get('/', function (req, res) {
  var filteredTodos = _.filter(todos, function (item) {
    return item.status === 'incomplete';
  })
  res.render('marionette/index', {todos: JSON.stringify(filteredTodos, null , 2)});
})

module.exports = router;
