const express = require('express');
const router = express.Router();

const auth = require('./auth');
const kanban = require('./kanban');
const { authLev1 } = require('../middlewares/auth');

router.use('/auth', auth);
router.use('/kanban', [authLev1], kanban);

module.exports = router;
