const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});