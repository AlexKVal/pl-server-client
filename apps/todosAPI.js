var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var todos = require('../data/data');
// var clients = {}; // sockets' collection

module.exports = function(io) {
  var router = express.Router();

  var nextId = todos.length + 1;

  var jsonParser = bodyParser.json();
  var urlencodedParser = bodyParser.urlencoded({extended: false});

  function pause(delay, err) {
    delay = delay || 1000;

    return function(req, res, next){
      setTimeout(next, delay, err);
    };
  };

  router.param('id', function (req, res, next, id) {
    req.id = parseInt(id, 10);
    next();
  })

  /**
   * jQuery client sends urlencoded form data and 'status' is the checkbox input
   * Backbone Model sends json data
   */
  function parsePostedData(req, res, next) {
    var postedData = req.body;

    if (postedData.status) {
      if (postedData.status === 'on') {
        postedData.status = 'complete';
      }
    } else {
      postedData.status = 'incomplete';
    }

    next();
  }

  router.use(pause(1000));

  router.route('/')
    .get(function (req, res) {
      if (req.query.limit >= 0) {
        res.json(todos.slice(0, req.query.limit));
      } else {
        res.json(todos);
      }
    })
    .post(jsonParser, urlencodedParser, parsePostedData, function (req, res) {
      var postedData = req.body;

      var newTodo = {
        id: nextId++,
        description: postedData.description,
        status: postedData.status
      }
      todos.push(newTodo);

      console.log('POST: server-list-updated');
      io.emit('server-list-updated');

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

      console.log('DELETE: server-list-updated');
      io.emit('server-list-updated');

      res.sendStatus(204);
    })
    .put(jsonParser, parsePostedData, function (req, res) {
      var foundTodoItem = _.find(todos, 'id', req.id);
      if (!foundTodoItem) res.status(404).json('There is no todo entry with id = ' + req.id);

      var postedData = req.body;

      foundTodoItem.description = postedData.description;
      foundTodoItem.status = postedData.status;

      console.log('PUT: server-list-updated');
      io.emit('server-list-updated');

      res.status(204).json(foundTodoItem);
    })
    // ember
    .patch(bodyParser.json({ type: 'application/vnd.api+json' }), function(req, res) {
      var patchData = req.body;

      var foundTodoItem = _.find(todos, 'id', +patchData.id);
      if (!foundTodoItem) res.status(404).json('There is no todo entry with id = ' + req.id);

      foundTodoItem.description = patchData.description;
      foundTodoItem.status = patchData.status;

      console.log('PATCH: server-list-updated');
      io.emit('server-list-updated');

      res.status(204).json(foundTodoItem);
    })

  router.param('ids', function (req, res, next, ids) {
    req.ids = ids.split(',').map(function(id) { return parseInt(id, 10) });
    next();
  })

  router.route('/packet/:ids')
    .delete(function(req, res) {
      req.ids.forEach(function(id) {
        _.remove(todos, 'id', id);
      });

      console.log('packet DELETE: server-list-updated');
      io.emit('server-list-updated');

      res.sendStatus(204);
    })

  router.route('/packet')
    .post(jsonParser, function(req, res) {
      todos.forEach(function(item) {
        item.status = req.body.newStatus;
      })

      console.log('packet PUT: server-list-updated');
      io.emit('server-list-updated');

      res.sendStatus(204);
    })

  // setup socket.io
  // io.on('connect', function(socket) {
  //   //
  // })

  return router;
}
