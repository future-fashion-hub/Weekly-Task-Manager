const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskController');

router.get('/', tasksController.getAllTasks);

router.get('/:id', tasksController.getTaskById);

router.post('/', tasksController.createTask);

router.put('/:id', tasksController.updateTask);

router.delete('/:id', tasksController.deleteTask);

router.get('/stats/summary', tasksController.getStatistics);

module.exports = router;
