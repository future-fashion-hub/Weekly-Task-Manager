const TaskModel = require('../models/taskModel');

exports.getAllTasks = (req, res, next) => {
  try {
    const { day } = req.query;
    let tasks;

    if (day) {
      tasks = TaskModel.getTasksByDay(day);
      if (tasks.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Задачи на день "${day}" не найдены`,
          data: []
        });
      }
    } else {
      tasks = TaskModel.getAllTasks();
    }

    res.status(200).json({
      success: true,
      message: 'Задачи успешно получены',
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = (req, res, next) => {
  try {
    const { id } = req.params;
    const task = TaskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Задача с ID ${id} не найдена`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Задача найдена',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = (req, res, next) => {
  try {
    const { title, description, day, priority, status } = req.body;

    if (!title || !day) {
      return res.status(400).json({
        success: false,
        message: 'Поля "title" и "day" обязательны'
      });
    }

    if (!TaskModel.DAYS_OF_WEEK.some(d => d.toLowerCase() === day.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `День "${day}" не является днём недели. Допустимые дни: ${TaskModel.DAYS_OF_WEEK.join(', ')}`
      });
    }

    if (priority && !TaskModel.PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Приоритет "${priority}" недействителен. Допустимые: ${TaskModel.PRIORITIES.join(', ')}`
      });
    }

    if (status && !TaskModel.STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Статус "${status}" недействителен. Допустимые: ${TaskModel.STATUSES.join(', ')}`
      });
    }

    const newTask = TaskModel.createTask({
      title,
      description,
      day,
      priority,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Задача успешно создана',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

// Обновить задачу
exports.updateTask = (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, day, priority, status } = req.body;

    if (!TaskModel.getTaskById(id)) {
      return res.status(404).json({
        success: false,
        message: `Задача с ID ${id} не найдена`
      });
    }

    if (day && !TaskModel.DAYS_OF_WEEK.some(d => d.toLowerCase() === day.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `День "${day}" не является днём недели`
      });
    }

    if (priority && !TaskModel.PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Приоритет "${priority}" недействителен`
      });
    }

    if (status && !TaskModel.STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Статус "${status}" недействителен`
      });
    }

    const updatedTask = TaskModel.updateTask(id, {
      title,
      description,
      day,
      priority,
      status
    });

    res.status(200).json({
      success: true,
      message: 'Задача успешно обновлена',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// Удалить задачу
exports.deleteTask = (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = TaskModel.deleteTask(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: `Задача с ID ${id} не найдена`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Задача успешно удалена',
      data: deletedTask
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = (req, res, next) => {
  try {
    const tasks = TaskModel.getAllTasks();
    const completed = tasks.filter(t => t.status === 'завершена').length;
    const inProgress = tasks.filter(t => t.status === 'в процессе').length;
    const newTasks = tasks.filter(t => t.status === 'новая').length;

    const byPriority = {
      высокий: tasks.filter(t => t.priority === 'высокий').length,
      средний: tasks.filter(t => t.priority === 'средний').length,
      низкий: tasks.filter(t => t.priority === 'низкий').length
    };

    res.status(200).json({
      success: true,
      message: 'Статистика получена',
      data: {
        total: tasks.length,
        statuses: {
          новая: newTasks,
          'в процессе': inProgress,
          завершена: completed
        },
        byPriority
      }
    });
  } catch (error) {
    next(error);
  }
};
