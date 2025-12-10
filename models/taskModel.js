const DAYS_OF_WEEK = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const PRIORITIES = ['низкий', 'средний', 'высокий'];

const STATUSES = ['новая', 'в процессе', 'завершена'];

let tasks = [
  {
    id: 1,
    title: 'Подготовка к лекции',
    description: 'Подготовить материалы для понедельника',
    day: 'Понедельник',
    priority: 'высокий',
    status: 'завершена',
    createdAt: new Date('2025-12-01')
  },
  {
    id: 2,
    title: 'Проверка домашних заданий',
    description: 'Проверить работы студентов',
    day: 'Вторник',
    priority: 'средний',
    status: 'в процессе',
    createdAt: new Date('2025-12-02')
  },
  {
    id: 3,
    title: 'Встреча с кураторами',
    description: 'Планерка в 10:00',
    day: 'Среда',
    priority: 'высокий',
    status: 'новая',
    createdAt: new Date('2025-12-03')
  },
  {
    id: 4,
    title: 'Составление отчёта',
    description: 'Квартальный отчёт',
    day: 'Четверг',
    priority: 'средний',
    status: 'новая',
    createdAt: new Date('2025-12-04')
  },
  {
    id: 5,
    title: 'Консультация студентов',
    description: 'Приём студентов 14:00-16:00',
    day: 'Пятница',
    priority: 'низкий',
    status: 'новая',
    createdAt: new Date('2025-12-05')
  }
];

let nextId = 6;

const getAllTasks = () => {
  return tasks;
};

const getTasksByDay = (day) => {
  return tasks.filter(task => task.day.toLowerCase() === day.toLowerCase());
};

const getTaskById = (id) => {
  return tasks.find(task => task.id === parseInt(id));
};

const createTask = (taskData) => {
  const newTask = {
    id: nextId++,
    title: taskData.title,
    description: taskData.description || '',
    day: taskData.day,
    priority: taskData.priority || 'средний',
    status: taskData.status || 'новая',
    createdAt: new Date()
  };
  tasks.push(newTask);
  return newTask;
};

const updateTask = (id, updates) => {
  const task = getTaskById(id);
  if (!task) return null;
  
  Object.assign(task, {
    title: updates.title || task.title,
    description: updates.description !== undefined ? updates.description : task.description,
    day: updates.day || task.day,
    priority: updates.priority || task.priority,
    status: updates.status || task.status
  });
  
  return task;
};

const deleteTask = (id) => {
  const index = tasks.findIndex(task => task.id === parseInt(id));
  if (index === -1) return null;
  
  const deleted = tasks[index];
  tasks.splice(index, 1);
  return deleted;
};

const deleteAllTasks = () => {
  tasks = [];
  nextId = 1;
};

module.exports = {
  DAYS_OF_WEEK,
  PRIORITIES,
  STATUSES,
  getAllTasks,
  getTasksByDay,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks
};
