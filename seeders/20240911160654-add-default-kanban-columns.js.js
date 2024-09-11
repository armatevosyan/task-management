'use strict';

module.exports = {
  up: async (queryInterface) => {
    const date = new Date();
    await queryInterface.bulkInsert(
      'KanbanColumns',
      [
        {
          title: 'Todo',
          slug: 'todo',
          createdAt: date,
          updatedAt: date,
        },
        {
          title: 'In progress',
          slug: 'inProgress',
          createdAt: date,
          updatedAt: date,
        },
        {
          title: 'Closed',
          slug: 'closed',
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
