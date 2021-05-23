const express = require('express');
const router = express.Router();
const db = require('./models');
const Handler = require('./handler');
const Validator = require('./validator');

router.post('/new', Validator.checkAddUser, Handler.create);

router.put('/submit-assessment', Validator.checkSubmission, Handler.submit);

router.get('/one/:email', Handler.one);

module.exports = router;