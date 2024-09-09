const { log } = require('../../helpers/logger');
const { Validators } = require('../../validators/auth');

const addRole = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Validators.createRole(body || {});

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    console.log('register');
    return res.status(200).json({
      message: 'Role created successfully',
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function addRole, ERROR ${err.message}`);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const register = async (req, res) => {
  try {
    console.log('register');
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function register, ERROR ${err.message}`);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = { addRole, register };
