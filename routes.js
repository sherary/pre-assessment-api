const express = require('express');
const router = express.Router();
const db = require('./models');
const Handler = require('./handler');
const Validator = require('./validator');

router.get('/all', Handler.all);

router.post('/new', Validator.create, Handler.create);

router.put('/submit-assessment', Validator.submit, Handler.submit);

router.get('/one', Handler.one);

module.exports = router;