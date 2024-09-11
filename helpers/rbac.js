const ADMIN = 'admin';
const WORKER = 'worker';

const ROLES = {
  ADMIN,
  WORKER,
};

const ADD_TASK = 'ADD_TASK';
const MOVE_TASK = 'MOVE_TASK';
const GET_COLUMNS = 'GET_COLUMNS';
const DELETE_UPDATE_COLUMN = 'DELETE_UPDATE_COLUMN';
const DELETE_UPDATE_TASK = 'DELETE_UPDATE_TASK';
const START_TASK = 'START_TASK';

const ACTIONS = {
  ADD_TASK,
  MOVE_TASK,
  GET_COLUMNS,
  DELETE_UPDATE_COLUMN,
  DELETE_UPDATE_TASK,
  START_TASK,
};

const RBAC_GRID = {
  worker: [MOVE_TASK, GET_COLUMNS, START_TASK],
};

const isActionAllowed = (role, action) => {
  if (role === ADMIN) {
    return true;
  }

  if (!RBAC_GRID[role]) return false;

  return RBAC_GRID[role].includes(action);
};

module.exports = {
  ROLES,
  ACTIONS,
  isActionAllowed,
};
