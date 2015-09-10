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
      // res.sendStatus(404);
    })
    .put(jsonParser, parsePostedData, function (req, res) {
      var foundTodoItem = _.find(todos, 'id', req.id);
      if (!foundTodoItem) res.status(404).json('There is no todo entry with id = ' + req.id);

      var postedData = req.body;

      foundTodoItem.description = postedData.description;
      foundTodoItem.status = postedData.status;

      // Object.keys(clients).forEach(function(socketId) {
      //   console.log('server put id: ', req.id, ' for socket: ', socketId);
      //   clients[socketId].emit('server put', req.id);
      // });

      res.status(204).json(foundTodoItem);
    })

  // setup socket.io
  io.on('connect', function(socket) {
    // console.log('socket connected id: ', socket.id);
    // clients[socket.id] = socket;
    //
    // socket.on('disconnect', function() {
    //   console.log('socket disconnected id: ', socket.id);
    //   delete clients[socket.id];
    // })

    socket.on('client modelchange', function(id) {
      console.log('client modelchange: ', id);
      socket.broadcast.emit('server modelchange', id);
    });

    socket.on('client modeldestroy', function(id) {
      console.log('client modeldestroy: ', id);
      socket.broadcast.emit('server modeldestroy', id);
    });

    socket.on('client modeladd', function(id) {
      console.log('client modeladd: ', id);
      socket.broadcast.emit('server modeladd', id);
    });
  })

  return router;
}
