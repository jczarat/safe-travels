var express = require('express');
var router = express.Router();
const searchCtrl = require('../controllers/search')

router.get('/', searchCtrl.index)


module.exports = router;