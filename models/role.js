'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    static associate() {}
  }
  Role.init(
    {
      name: {
        type: Sequelize.ENUM('admin', 'worker'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    },
  );
  return Role;
};
