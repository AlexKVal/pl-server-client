var express = require('express');
var _ = require('lodash');
var todos = require('../bbApp/data');

var todos = _.filter(todos, function (item) {
  return item.status === 'incomplete';
})

var router = express.Router();

router.use('/', express.static('bbApp'));

router.get('/', function (req, res) {
  res.render('bbApp', {todos: JSON.stringify(todos, null , 2)});
})

module.exports = router;
