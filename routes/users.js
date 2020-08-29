var express = require('express');
var router = express.Router();
var usersCtrl = require('../controllers/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//Middleware for use inside actions only users can take
function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;

