const { Kanban, TaskTracking, sequelize } = require('../../models');
const { Op, QueryTypes } = require('sequelize');
const { log } = require('../../helpers/logger');
const moment = require('moment');

const generateTaskCompletionReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const whereConditions = {
      [Op.and]: [
        { status: 'Closed' },
        {
          dueDate: {
            [Op.gte]: moment(startDate).toDate(),
            [Op.lte]: moment(endDate).toDate(),
          },
        },
      ],
    };

    if (userId) {
      whereConditions[Op.and].push({ '$tracking.userId$': userId });
    }

    const tasks = await Kanban.findAll({
      where: whereConditions,
      include: [
        {
          model: TaskTracking,
          as: 'tracking',
          attributes: ['userId', 'startTime', 'endTime', 'duration'],
        },
      ],
      attributes: ['id', 'title', 'status', 'createdAt', 'updatedAt'],
    });

    const totalTasksCompleted = await sequelize.query(
      `(
          SELECT COUNT("Task"."id")
          FROM "Kanbans" AS "Task"
          INNER JOIN "TaskTrackings" AS "tracking"
          ON "Task"."id" = "tracking"."taskId"
          WHERE "tracking"."userId" = ${userId || 'NULL'}
        )`,
      { type: QueryTypes.SELECT },
    );

    const averageCompletionTime = await sequelize.query(
      `(
          SELECT AVG("tracking"."duration")
          FROM "TaskTrackings" AS "tracking"
          WHERE "tracking"."userId" = ${userId || 'NULL'}
        )`,
      { type: QueryTypes.SELECT },
    );

    const report = {
      tasks: tasks.map((task) => ({
        taskId: task.id,
        taskName: task.title,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        tracking: task.tracking.map((track) => ({
          userId: track.userId,
          startTime: track.startTime,
          endTime: track.endTime,
          duration: track.duration,
        })),
      })),
      statistics: {
        totalTasksCompleted: parseInt(totalTasksCompleted[0].count, 10),
        averageCompletionTime: parseFloat(averageCompletionTime[0].avg).toFixed(
          2,
        ),
      },
    };

    return res.status(200).json({
      message: 'Success',
      data: report,
    });
  } catch (err) {
    console.log(err);

    log.error(
      `Catch for function generateTaskCompletionReport,ERROR ${err.message}`,
    );
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = { generateTaskCompletionReport };
