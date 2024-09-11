const express = require('express');
const router = express.Router();

const auth = require('./auth');
const kanban = require('./kanban');
const reporting = require('./reporting');
const { authLev1 } = require('../middlewares/auth');

router.use('/auth', auth);
router.use('/kanban', [authLev1], kanban);
router.use('/reporting', [authLev1], reporting);

module.exports = router;
