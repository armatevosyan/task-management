const { log } = require('../../helpers/logger');
const { Validators } = require('../../validators/kanban');
const { Kanban, KanbanColumn, User, TaskTracking } = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment');

const notAllowed = ['todo', 'closed', 'inProgress'];

const addColumn = async (req, res) => {
  try {
    const data = req.body || {};

    const { error } = Validators.createColumn(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { title, slug } = data;

    if (notAllowed.includes(slug)) {
      return res.status(400).json({
        message: 'Not allowed to add this column',
      });
    }

    const column = await KanbanColumn.findOne({
      where: {
        title,
        slug,
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
      message: 'Column created successfully',
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

const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || {};

    const { error } = Validators.createColumn(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { title, slug } = data;

    if (notAllowed.includes(slug)) {
      return res.status(400).json({
        message: 'Not allowed to add this column',
      });
    }

    const column = await KanbanColumn.findByPk(id);

    if (!column) {
      return res.status(404).json({
        message: 'Column not found',
      });
    }

    const existingColumn = await KanbanColumn.findOne({
      where: {
        title,
        slug,
        id: {
          [Op.not]: id,
        },
      },
    });

    if (existingColumn) {
      return res.status(400).json({
        message: 'Column with this name already created',
      });
    }

    await column.update(data);

    return res.status(200).json({
      message: 'Column updated successfully',
      data: column,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function updateColumn, ERROR ${err.message}`);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await KanbanColumn.findOne({
      where: {
        id,
        slug: {
          [Op.not]: notAllowed,
        },
      },
    });

    if (!column) {
      return res.status(404).json({
        message: 'Column not found or not allowed to remove',
      });
    }

    await column.destroy();

    return res.status(200).json({
      message: 'Column deleted successfully',
      data: id,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function deleteColumn, ERROR ${err.message}`);

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
      status: column.title,
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

const getColumns = async (req, res) => {
  try {
    const { orderBy = 'createdAt', direction = 'DESC' } = req.query;

    let columns = await KanbanColumn.findAll({
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
      },
      include: [
        {
          model: Kanban,
          as: 'tasks',
          attributes: ['id'],
        },
      ],
      order: [[orderBy, direction]],
    });

    return res.status(200).json({
      message: 'Success',
      data: columns,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function getColumns, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { orderBy = 'createdAt', direction = 'DESC' } = req.query;
    let tasks = await Kanban.findAll({
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
      },
      include: [
        {
          model: KanbanColumn,
          as: 'column',
          attributes: ['id'],
        },
      ],
      order: [[orderBy, direction]],
    });

    return res.status(200).json({
      message: 'Success',
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function getTasks, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    let task = await Kanban.findByPk(id, {
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
      },
      include: [
        {
          model: KanbanColumn,
          as: 'column',
          attributes: ['id'],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Success',
      data: task,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function getTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, user } = req;

    const data = req.body || {};
    const { error } = Validators.createTicket(data);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const existingTask = await Kanban.findByPk(id);
    if (!existingTask) {
      return res.status(404).json({
        message: 'Task not found',
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
    if (column.slug === 'closed') {
      const existingTrack = await TaskTracking.findOne({
        where: {
          taskId: existingTask.id,
        },
      });
      if (existingTrack) {
        const duration = moment().diff(moment(existingTrack.startTime)) / 1000;

        await existingTrack.update({
          duration: existingTrack.duration + duration,
          endTime: new Date(),
        });
      }
    }

    await existingTask.update({
      ...rest,
      columnId,
      createdBy,
      status: column.title,
    });

    await existingTask.reload({
      include: { model: KanbanColumn, as: 'column' },
    });

    return res.status(200).json({
      message: 'Task updated successfully',
      data: existingTask,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function updateTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await Kanban.findByPk(id);
    if (!existingTask) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    await existingTask.destroy();

    return res.status(200).json({
      message: 'Task deleted successfully',
      data: id,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function deleteTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const assignTask = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const task = await Kanban.findByPk(id);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await task.update({ userId: user.id });
    await task.reload({
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password', 'verifyToken'],
        },
      },
    });

    return res.status(200).json({
      message: 'Task assigned successfully',
      data: task,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function assignTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const startTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const task = await Kanban.findByPk(id);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }
    const existingTask = await TaskTracking.findOne({
      where: {
        taskId: task.id,
        userId: user.id,
      },
    });
    if (existingTask) {
      return res.status(400).json({
        message: 'Task already started',
      });
    }

    await TaskTracking.create({
      taskId: task.id,
      userId: user.id,
      startTime: new Date(),
    });

    return res.status(200).json({
      message: 'Task started successfully',
      data: task,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function startTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const stopTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const task = await Kanban.findByPk(id);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const existingTask = await TaskTracking.findOne({
      where: {
        taskId: task.id,
        userId: user.id,
      },
    });

    const duration = moment().diff(moment(existingTask.startTime)) / 1000;

    await existingTask.update({
      duration: existingTask.duration + duration,
      endTime: new Date(),
    });

    return res.status(200).json({
      message: 'Task stop successfully',
      data: task,
    });
  } catch (err) {
    console.log(err);
    log.error(`Catch error in the function stopTask, ERROR ${err.message}`);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

module.exports = {
  addColumn,
  updateColumn,
  deleteColumn,
  addTask,
  getColumns,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTask,
  startTask,
  stopTask,
};
