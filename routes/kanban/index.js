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

router.put(
  '/column/:id',
  validateActionAllowed(ACTIONS.DELETE_UPDATE_COLUMN),
  controller.updateColumn,
);

router.delete(
  '/column/:id',
  validateActionAllowed(ACTIONS.DELETE_UPDATE_COLUMN),
  controller.deleteColumn,
);

router.post(
  '/add-task',
  validateActionAllowed(ACTIONS.ADD_TASK),
  controller.addTask,
);

router.get(
  '/get-columns',
  validateActionAllowed(ACTIONS.GET_COLUMNS),
  controller.getColumns,
);

router.get(
  '/get-tasks',
  validateActionAllowed(ACTIONS.GET_COLUMNS),
  controller.getTasks,
);

router.get(
  '/get-task/:id',
  validateActionAllowed(ACTIONS.GET_COLUMNS),
  controller.getTask,
);

router.put(
  '/task/:id',
  validateActionAllowed(ACTIONS.GET_COLUMNS),
  controller.updateTask,
);

router.delete(
  '/task/:id',
  validateActionAllowed(ACTIONS.DELETE_UPDATE_TASK),
  controller.deleteTask,
);

router.patch(
  '/assign/:id/:userId',
  validateActionAllowed(ACTIONS.DELETE_UPDATE_TASK),
  controller.assignTask,
);

router.put(
  '/start-task/:id',
  validateActionAllowed(ACTIONS.START_TASK),
  controller.startTask,
);

router.put(
  '/stop-task/:id',
  validateActionAllowed(ACTIONS.START_TASK),
  controller.stopTask,
);

module.exports = router;
