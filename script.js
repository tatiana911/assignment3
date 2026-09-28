const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const feedback = document.querySelector('#feedback');
const list = document.querySelector('#task-list');
const emptyMessage = document.querySelector('#empty-message');
const taskCount = document.querySelector('#task-count');

let tasks = loadTasks();
let nextId = Number(localStorage.getItem('nextId')) || 1;

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  return JSON.parse(saved) || [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function makeTaskElement(task) {
  const item = document.createElement('li');
  const toggleButton = document.createElement('button');
  const title = document.createElement('span');
  const deleteButton = document.createElement('button');

  item.classList.add('task');
  if (task.completed) item.classList.add('done');
  item.dataset.id = task.id;

  toggleButton.classList.add('toggle');
  toggleButton.textContent = task.completed ? 'Undo' : 'Done';
  toggleButton.setAttribute('type', 'button');
  toggleButton.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');

  title.classList.add('task-title');
  title.textContent = task.title;

  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('type', 'button');
  deleteButton.setAttribute('aria-label', 'Delete task');

  item.append(toggleButton, title, deleteButton);
  return item;
}

function renderTasks() {
  list.innerHTML = '';
  tasks.map(makeTaskElement).forEach(item => list.append(item));
  emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
}

function addTask(event) {
  event.preventDefault();
  const title = input.value.trim();
  if (title === '') {
    feedback.textContent = 'Please enter a task before adding it.';
    return;
  }

  tasks.push({ id: String(nextId), title: title, completed: false });
  nextId = nextId + 1;
  localStorage.setItem('nextId', String(nextId));
  saveTasks();
  renderTasks();
  input.value = '';
  feedback.textContent = '';
  input.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function handleListClick(event) {
  const item = event.target.closest('li');
  if (!item) return;
  if (event.target.closest('.delete')) {
    deleteTask(item.dataset.id);
  } else if (event.target.closest('.toggle')) {
    toggleTask(item.dataset.id);
  }
}

form.addEventListener('submit', addTask);
list.addEventListener('click', handleListClick);
renderTasks();
