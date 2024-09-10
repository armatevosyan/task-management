'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class TaskTracking extends Model {
    static associate() {
      // define association here
    }
  }
  TaskTracking.init(
    {
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Kanbans',
          key: 'id',
        },
        onDelete: 'cascade',
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'cascade',
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'TaskTracking',
    },
  );
  return TaskTracking;
};
