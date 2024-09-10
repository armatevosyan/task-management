const express = require('express');
const router = express.Router();

const controller = require('../../controlers/kanban');
const { validateActionAllowed } = require('../../middlewares/permission');
const { ACTIONS } = require('../../helpers/rbac');

router.post(
  '/add-column',
  validateActionAllowed(ACTIONS.ADD_TASK),
  controller.addColumn,
);

router.post(
  '/add-task',
  validateActionAllowed(ACTIONS.ADD_TASK),
  controller.addTask,
);

module.exports = router;
