var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    res.render('index', { title: 'Express', users});
  })
});

router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/',
    failureRedirect : '/'
  }
));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
