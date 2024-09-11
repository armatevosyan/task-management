const { log } = require('../../helpers/logger');
const generateToken = require('../../helpers/generateToken');
const { Validators } = require('../../validators/auth');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User, Role, sequelize } = require('../../models');

const addRole = async (req, res) => {
  try {
    const { body } = req;
    const { error } = Validators.createRole(body || {});

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const existingRole = await Role.findOne({
      where: {
        name: body.name,
      },
    });

    if (existingRole) {
      return res.status(400).json({
        message: 'Role already exists',
      });
    }
    const role = await Role.create(body);

    return res.status(200).json({
      message: 'Role created successfully',
      data: role,
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
  let transaction;
  try {
    const data = req.body || {};
    const { error } = Validators.createUser(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    transaction = await sequelize.transaction({ autocommit: false });

    const existingUser = await User.findOne({
      where: { email: data.email },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'User with the same email already exist!',
      });
    }

    const existingRole = await Role.findByPk(data.roleId, { transaction });

    if (!existingRole) {
      await transaction.rollback();
      return res.status(404).json({
        message: 'Role not found',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    const verifyToken = generateToken(15);

    const user = await User.create(
      {
        ...data,
        password,
        verifyToken,
      },
      { transaction },
    );

    const token = jwt.sign(
      {
        sub: user.id,
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.APP_SECRET,
    );

    await user.reload({
      attributes: {
        exclude: ['password', 'verifyToken'],
      },
      transaction,
    });
    await transaction.commit();

    return res.json({
      message: 'User successfully registered',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function register, ERROR ${err.message}`);
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body || {};

    const { error } = Validators.auth(data);

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
      });
    }

    let user = await User.findOne({
      where: { email: data.email },
      attributes: {
        exclude: ['password', 'verifyToken'],
      },
    });

    if (!user) {
      log.error('Failed login attempt: Invalid credentials');
      return res.status(400).json({
        message: 'Failed login attempt: Invalid credentials',
      });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      log.error('Failed login attempt: Invalid credentials');
      return res.status(400).json({
        message: 'Failed login attempt: Invalid credentials',
      });
    }
    const token = jwt.sign(
      {
        sub: user.id,
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.APP_SECRET,
    );

    return res.status(200).json({
      message: 'Login success',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    log.error(`Catch error in the function login, ERROR ${err.message}`);
    console.log(err);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = { addRole, register, login };
