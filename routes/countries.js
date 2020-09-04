var express = require('express');
var router = express.Router();
const countriesCtrl = require('../controllers/countries');

router.get('/', countriesCtrl.index);
router.get('/:id', countriesCtrl.show);

module.exports = router;