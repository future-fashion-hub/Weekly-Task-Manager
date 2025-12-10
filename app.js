const express = require('express');
const path = require('path');
const app = express();
const tasksRouter = require('./routes/tasks');
const { loggingMiddleware, validationMiddleware } = require('./middleware/custom');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера'
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API документация: GET/POST http://localhost:${PORT}/api/tasks`);
});

module.exports = app;
