var express = require('express');

var router = express.Router();

router.use('/', express.static('bbApp'));

router.get('/', function (req, res) {
  res.render('bbApp', {myVar: 'world'});
})

module.exports = router;
