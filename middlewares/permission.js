const { isActionAllowed } = require('../helpers/rbac');
const validateActionAllowed = (action) => (req, res, next) => {
  if (isActionAllowed(req.user.role, action)) {
    next();
    return;
  }

  return res
    .status(400)
    .json({ message: 'Not enough permission to perform the request' });
};

module.exports = {
  validateActionAllowed,
};
