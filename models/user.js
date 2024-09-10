'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    static associate() {
      // define association here
    }
  }
  User.init(
    {
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onDelete: 'Cascade',
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verifyToken: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      verifyDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
