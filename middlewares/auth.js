const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const { log } = require('../helpers/logger');
const moment = require('moment');

const authLev1 = async function (req, res, next) {
  try {
    const token = req.header('Authorization');

    if (!token) {
      log.error('Access denied.', { status: 401 });
      return res.status(401).json({ message: 'Access denied.' });
    }

    let bearerToken = token.split(' ').pop();

    if (!bearerToken) {
      log.error('Access denied.', { status: 401 });
      return res.status(401).json({ message: 'Access denied.' });
    }

    const decoded = jwt.verify(bearerToken, process.env.APP_SECRET);
    const { exp: expireDate, sub: userId } = decoded;

    const now = new Date().toISOString();
    const expiryDate = new Date(expireDate * 1000).toISOString();
    log.info(
      `Access token will expire at ${moment(expiryDate)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')}`,
    );
    const isExpired = now > expiryDate;

    if (isExpired) {
      log.error('Access denied.', { status: 401 });
      return res.status(401).json({ message: 'Access denied.' });
    } else {
      const refreshToken = jwt.sign(
        {
          sub: userId,
          iat: Date.now(),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        process.env.APP_SECRET,
      );
      res.set({
        'Refresh-Token': refreshToken,
        'Access-Control-Expose-Headers': 'Refresh-Token',
      });
    }

    req.user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!req.user) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const role = await Role.findByPk(req.user.roleId);
    req.user.role = role.name;

    next();
  } catch (e) {
    console.log(e);
    log.error('Invalid token.', { status: 401 });
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = {
  authLev1,
};
