const API_URL = '/api/tasks';

let allTasks = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  await loadTasks();
  setupEventListeners();
  updateStatistics();
}

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      allTasks = data.data;
      renderTasks(allTasks);
    } else {
      showNotification('Ошибка при загрузке задач', 'error');
    }
  } catch (error) {
    showNotification('Ошибка подключения к серверу', 'error');
  }
}

async function addTask(taskData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Задача успешно создана', 'success');
      await loadTasks();
      clearAddTaskForm();
      updateStatistics();
    } else {
      showNotification(`${data.message}`, 'error');
    }
  } catch (error) {
    showNotification('Ошибка при создании задачи', 'error');
  }
}

async function updateTask(taskId, taskData) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Задача обновлена', 'success');
      await loadTasks();
      closeEditModal();
      updateStatistics();
    } else {
      showNotification(`${data.message}`, 'error');
    }
  } catch (error) {
    showNotification('Ошибка при обновлении задачи', 'error');
  }
}

async function deleteTask(taskId) {
  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Задача удалена', 'success');
      await loadTasks();
      updateStatistics();
    } else {
      showNotification(`${data.message}`, 'error');
    }
  } catch (error) {
    showNotification('Ошибка при удалении задачи', 'error');
  }
}

// ============ ОТРИСОВКА ТАБЛИЦЫ ============
function renderTasks(tasks) {
  const tbody = document.getElementById('tasksTableBody');
  
  if (tasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-message">Нет задач</td></tr>';
    return;
  }

  tbody.innerHTML = tasks.map(task => `
    <tr>
      <td>${task.id}</td>
      <td><strong>${task.title}</strong></td>
      <td>${task.description || '—'}</td>
      <td>${task.day}</td>
      <td><span class="priority-${getPriorityClass(task.priority)}">${capitalizeFirst(task.priority)}</span></td>
      <td><span class="status-${getStatusClass(task.status)}">${capitalizeFirst(task.status)}</span></td>
      <td>${formatDate(task.createdAt)}</td>
      <td>
        <button class="btn btn-edit" onclick="openEditModal(${task.id})">Редакт.</button>
        <button class="btn btn-delete" onclick="deleteTask(${task.id})">Удалить</button>
      </td>
    </tr>
  `).join('');
}

function setupEventListeners() {
  document.getElementById('dayFilter').addEventListener('change', (e) => {
    const selectedDay = e.target.value;
    if (selectedDay) {
      const filtered = allTasks.filter(task => task.day === selectedDay);
      renderTasks(filtered);
    } else {
      renderTasks(allTasks);
    }
  });

  document.getElementById('addTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      day: document.getElementById('taskDay').value,
      priority: document.getElementById('taskPriority').value,
      status: document.getElementById('taskStatus').value
    };

    addTask(newTask);
  });

  document.getElementById('editTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const updates = {
      title: document.getElementById('editTaskTitle').value,
      description: document.getElementById('editTaskDescription').value,
      day: document.getElementById('editTaskDay').value,
      priority: document.getElementById('editTaskPriority').value,
      status: document.getElementById('editTaskStatus').value
    };

    updateTask(taskId, updates);
  });

  document.querySelector('.btn-cancel').addEventListener('click', closeEditModal);

  document.querySelector('.close-btn').addEventListener('click', closeEditModal);

  document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('editModal')) {
      closeEditModal();
    }
  });
}

function openEditModal(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  
  if (!task) return;

  document.getElementById('editTaskId').value = task.id;
  document.getElementById('editTaskTitle').value = task.title;
  document.getElementById('editTaskDescription').value = task.description || '';
  document.getElementById('editTaskDay').value = task.day;
  document.getElementById('editTaskPriority').value = task.priority;
  document.getElementById('editTaskStatus').value = task.status;

  document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
}

async function updateStatistics() {
  try {
    const response = await fetch(`${API_URL}/stats/summary`);
    const data = await response.json();

    if (data.success) {
      const stats = data.data;
      document.getElementById('totalCount').textContent = stats.total;
      document.getElementById('completedCount').textContent = stats.statuses.завершена;
      document.getElementById('inProgressCount').textContent = stats.statuses['в процессе'];
    }
  } catch (error) {
  }
}

function clearAddTaskForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDay').value = '';
  document.getElementById('taskPriority').value = 'средний';
  document.getElementById('taskStatus').value = 'новая';
}

function getPriorityClass(priority) {
  const map = {
    'высокий': 'high',
    'средний': 'medium',
    'низкий': 'low'
  };
  return map[priority] || 'medium';
}

function getStatusClass(status) {
  const map = {
    'новая': 'new',
    'в процессе': 'in-progress',
    'завершена': 'completed'
  };
  return map[status] || 'new';
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
