const ADMIN = 'admin';
const WORKER = 'worker';

const ROLES = {
  ADMIN,
  WORKER,
};

const ADD_TASK = 'ADD_TASK';
const MOVE_TASK = 'MOVE_TASK';

const ACTIONS = {
  ADD_TASK,
  MOVE_TASK,
};

const RBAC_GRID = {
  worker: [MOVE_TASK],
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
