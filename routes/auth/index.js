const express = require('express');
const router = express.Router();

const controller = require('../../controlers/auth');

router.post('/create-role', controller.addRole);
router.post('/register', controller.register);

module.exports = router;
