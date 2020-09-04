var express = require('express');
var router = express.Router();
const commentsCtrl = require('../controllers/comments');

router.get('/comments/:id/edit', isLoggedIn, commentsCtrl.edit);
router.post('/countries/:id/comments', isLoggedIn, commentsCtrl.create);
router.delete('/comments/:id', isLoggedIn, commentsCtrl.delete);
router.put('/comments/:id', isLoggedIn, commentsCtrl.update);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
}

module.exports = router;