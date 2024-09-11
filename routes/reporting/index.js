const express = require('express');
const router = express.Router();

const controller = require('../../controlers/reporting');
const { validateActionAllowed } = require('../../middlewares/permission');
const { ACTIONS } = require('../../helpers/rbac');

router.get(
  '/task-completion-report/:userId',
  validateActionAllowed(ACTIONS.ADD_TASK),
  controller.generateTaskCompletionReport,
);

module.exports = router;
