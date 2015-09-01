var express = require('express');
var todos = require('../bbApp/data');

var router = express.Router();

router.use('/', express.static('bbApp'));

router.get('/', function (req, res) {
  res.render('bbApp', {todos: JSON.stringify(todos, null , 2)});
})

module.exports = router;
