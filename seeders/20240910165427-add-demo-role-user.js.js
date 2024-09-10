'use strict';

const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const hash = bcrypt.hashSync('92d}U(wQ', 10);
    const date = new Date();
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'admin',
          createdAt: date,
          updatedAt: date,
        },
      ],
      {},
    );

    const role = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'admin';`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'John Doe',
          lastName: 'John Do',
          email: 'super-admin@taskmanagement.com',
          password: hash,
          roleId: role[0].id,
          verifyToken: 'a4sa4sa444a4a4a4a4a',
          phone: '+374 95333333',
          verifyDate: date,
          createdAt: date,
          updatedAt: date,
        },
        {
          firstName: 'John Junior',
          lastName: 'Do',
          email: 'admin@taskmanagement.com',
          password: hash,
          roleId: role[0].id,
          verifyToken: 'a4sa4sa444a4a253434343',
          phone: '+374 95444444',
          verifyDate: date,
          createdAt: date,
          updatedAt: date,
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
