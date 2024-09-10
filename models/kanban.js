'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Kanban extends Model {
    static associate({ KanbanColumn }) {
      Kanban.belongsTo(KanbanColumn, { foreignKey: 'columnId', as: 'column' });
    }
  }
  Kanban.init(
    {
      columnId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'KanbanColumns',
          key: 'id',
        },
        onDelete: 'Cascade',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: true,
        defaultValue: null,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'no action',
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'no action',
      },
    },
    {
      sequelize,
      modelName: 'Kanban',
    },
  );
  return Kanban;
};
