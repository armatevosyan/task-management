const dotenv = require('dotenv');

const { log } = require('../helpers/logger');
const db = require('../models');

const initializeService = async () => {
  try {
    dotenv.config();
    await db.sequelize.sync();
    return {
      message: 'success',
    };
  } catch (e) {
    console.log(e);
    log.error(`Catch for initializeService, ERROR: ${JSON.stringify(e)}`);
    throw Error(e);
  }
};

module.exports = initializeService;
