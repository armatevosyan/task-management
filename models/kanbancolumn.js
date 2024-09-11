'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class KanbanColumn extends Model {
    static associate({ Kanban }) {
      KanbanColumn.hasMany(Kanban, { foreignKey: 'columnId', as: 'tasks' });
    }
  }
  KanbanColumn.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'KanbanColumn',
    },
  );
  return KanbanColumn;
};
