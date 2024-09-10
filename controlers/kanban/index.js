const { log } = require('../../helpers/logger');
const { Validators } = require('../../validators/kanban');
const { User, Kanban, KanbanColumn } = require('../../models');

const addColumn = async (req, res) => {
  try {
    const data = req.body || {};

    const { error } = Validators.createColumn(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { title } = data;
    const column = await KanbanColumn.findOne({
      where: {
        title,
      },
    });

    if (column) {
      return res.status(400).json({
        message: 'Column with this name already created',
      });
    }

    const newColumn = await KanbanColumn.create(data);

    if (newColumn) {
      await newColumn.reload({
        include: {
          model: Kanban,
          as: 'tasks',
        },
      });
    }

    return res.status(200).json({
      message: 'Success',
      data: newColumn,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function addColumn, ERROR ${err.message}`);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const addTask = async (req, res) => {
  try {
    const { body, user } = req;

    const data = req.body || {};
    const { error } = Validators.createTicket(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    let createdBy = user.id;

    const { columnId, ...rest } = body;
    const column = await KanbanColumn.findByPk(columnId);

    if (!column) {
      return res.status(400).json({
        message: 'Column not exists',
      });
    }
    const task = await Kanban.create({
      ...rest,
      columnId,
      createdBy,
    });

    await task.reload({
      include: { model: KanbanColumn, as: 'column' },
    });

    return res.status(200).json({
      message: 'Task created successfully',
      data: task,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function addTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  addColumn,
  addTask,
};
