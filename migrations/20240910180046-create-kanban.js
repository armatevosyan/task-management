'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kanbans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      columnId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'KanbanColumns',
          key: 'id',
        },
        onDelete: 'Cascade',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Kanbans');
  },
};
