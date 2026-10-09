/**
 * FocusFlow — Frontend Application Logic
 */

// Application State
let todos = [];
let currentFilter = 'all';

// DOM Element References
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDesc = document.getElementById('empty-desc');

const progressBarFill = document.getElementById('progress-bar-fill');
const progressStatsText = document.getElementById('progress-stats-text');
const progressPercentageBadge = document.getElementById('progress-percentage-badge');
const progressBarWidget = document.getElementById('progress-bar-widget');

const filterTabs = document.querySelectorAll('.filter-tab');
const countAll = document.getElementById('count-all');
const countActive = document.getElementById('count-active');
const countCompleted = document.getElementById('count-completed');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentDateEl = document.getElementById('current-date');
const toastContainer = document.getElementById('toast-container');
const confettiCanvas = document.getElementById('confetti-canvas');

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDateDisplay();
  initTheme();
  bindEventListeners();
  loadTodos();
});

// ==========================================================================
// Date & Theme
// ==========================================================================

function initDateDisplay() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  currentDateEl.textContent = today.toLocaleDateString(undefined, options);
}

function initTheme() {
  const savedTheme = localStorage.getItem('focusflow-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('focusflow-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'theme');
  });
}

// ==========================================================================
// Event Listeners
// ==========================================================================

function bindEventListeners() {
  // Add task submit
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    const priority = prioritySelect.value;
    if (!title) return;

    await addTask(title, priority);
    todoInput.value = '';
    todoInput.focus();
  });

  // Filter clicks
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentFilter = tab.getAttribute('data-filter');
      renderTodos();
    });
  });

  // Clear completed tasks
  clearCompletedBtn.addEventListener('click', async () => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount === 0) return;

    try {
      const response = await fetch('/api/todos-completed', { method: 'DELETE' });
      if (response.ok) {
        todos = todos.filter((t) => !t.completed);
        renderTodos();
        showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'info');
      }
    } catch (err) {
      console.error('Failed to clear completed tasks:', err);
      showToast('Error clearing completed tasks', 'error');
    }
  });
}

// ==========================================================================
// API Operations
// ==========================================================================

async function loadTodos() {
  try {
    const res = await fetch('/api/todos');
    if (!res.ok) throw new Error('Network error');
    todos = await res.json();
    renderTodos();
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    showToast('Failed to load tasks', 'error');
  }
}

async function addTask(title, priority) {
  // Optimistic UI representation
  const tempId = 'temp-' + Date.now();
  const optimisticTodo = {
    id: tempId,
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.unshift(optimisticTodo);
  renderTodos();

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority })
    });

    if (!res.ok) throw new Error('Create failed');
    const createdTodo = await res.json();
    
    // Replace temp item with server response
    const index = todos.findIndex((t) => t.id === tempId);
    if (index !== -1) {
      todos[index] = createdTodo;
      renderTodos();
    }
    showToast('Task added successfully', 'success');
  } catch (err) {
    console.error('Failed to add task:', err);
    todos = todos.filter((t) => t.id !== tempId);
    renderTodos();
    showToast('Failed to save task', 'error');
  }
}

async function toggleTask(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const previousState = todo.completed;
  const newState = !previousState;
  todo.completed = newState;
  
  const wasAllDoneBefore = todos.length > 0 && todos.every((t) => t.completed);

  renderTodos();

  if (newState && todos.every((t) => t.completed) && todos.length > 0) {
    triggerConfetti();
    showToast('All tasks completed! Amazing work 🎉', 'success');
  }

  try {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newState })
    });
    if (!res.ok) throw new Error('Update failed');
  } catch (err) {
    console.error('Failed to toggle task:', err);
    todo.completed = previousState;
    renderTodos();
    showToast('Failed to update task state', 'error');
  }
}

async function deleteTask(id, itemElement) {
  if (itemElement) {
    itemElement.classList.add('deleting');
  }

  setTimeout(async () => {
    const taskIndex = todos.findIndex((t) => t.id === id);
    const removedTask = todos[taskIndex];
    if (taskIndex !== -1) {
      todos.splice(taskIndex, 1);
      renderTodos();
    }

    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Task deleted', 'info');
    } catch (err) {
      console.error('Failed to delete task:', err);
      if (removedTask) {
        todos.splice(taskIndex, 0, removedTask);
        renderTodos();
      }
      showToast('Failed to delete task', 'error');
    }
  }, 220);
}

async function updateTaskTitle(id, newTitle) {
  const todo = todos.find((t) => t.id === id);
  if (!todo || !newTitle.trim() || newTitle.trim() === todo.title) {
    renderTodos();
    return;
  }

  const oldTitle = todo.title;
  todo.title = newTitle.trim();
  renderTodos();

  try {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title })
    });
    if (!res.ok) throw new Error('Update failed');
    showToast('Task updated', 'success');
  } catch (err) {
    console.error('Failed to update task title:', err);
    todo.title = oldTitle;
    renderTodos();
    showToast('Failed to save update', 'error');
  }
}

// ==========================================================================
// Rendering
// ==========================================================================

function renderTodos() {
  // Update Counts
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  countAll.textContent = total;
  countActive.textContent = active;
  countCompleted.textContent = completed;

  // Clear completed button state
  clearCompletedBtn.disabled = completed === 0;

  // Update Progress Bar
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBarFill.style.width = `${percentage}%`;
  progressBarWidget.setAttribute('aria-valuenow', percentage);
  progressStatsText.textContent = `${completed} of ${total} completed`;
  progressPercentageBadge.textContent = `${percentage}%`;

  if (percentage === 100 && total > 0) {
    progressPercentageBadge.classList.add('completed');
  } else {
    progressPercentageBadge.classList.remove('completed');
  }

  // Filter tasks
  let filtered = todos;
  if (currentFilter === 'active') {
    filtered = todos.filter((t) => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = todos.filter((t) => t.completed);
  }

  // Clear list
  todoList.innerHTML = '';

  // Handle Empty State
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    if (total === 0) {
      emptyTitle.textContent = 'No tasks yet';
      emptyDesc.textContent = 'What do you want to achieve today? Add your first task above!';
    } else if (currentFilter === 'active') {
      emptyTitle.textContent = 'All tasks completed!';
      emptyDesc.textContent = 'Awesome! You have finished everything on your list. 🎉';
    } else if (currentFilter === 'completed') {
      emptyTitle.textContent = 'No completed tasks';
      emptyDesc.textContent = 'Check off tasks as you finish them to see them here.';
    }
  } else {
    emptyState.classList.add('hidden');
  }

  // Build items
  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.id = `todo-${todo.id}`;
    li.setAttribute('data-priority', todo.priority || 'medium');

    // Checkbox button
    const checkboxBtn = document.createElement('button');
    checkboxBtn.className = 'todo-checkbox';
    checkboxBtn.id = `checkbox-${todo.id}`;
    checkboxBtn.setAttribute('aria-label', todo.completed ? 'Mark incomplete' : 'Mark complete');
    checkboxBtn.setAttribute('role', 'checkbox');
    checkboxBtn.setAttribute('aria-checked', todo.completed ? 'true' : 'false');
    checkboxBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    checkboxBtn.addEventListener('click', () => toggleTask(todo.id));

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'todo-title';
    titleSpan.id = `title-${todo.id}`;
    titleSpan.textContent = todo.title;
    titleSpan.title = 'Double-click to edit';

    // Double click to inline-edit
    titleSpan.addEventListener('dblclick', () => enableInlineEdit(todo, titleSpan));

    // Metadata: priority badge and timestamp
    const metaDiv = document.createElement('div');
    metaDiv.className = 'todo-meta';

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-pill ${todo.priority || 'medium'}`;
    priorityBadge.textContent = todo.priority || 'medium';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = formatRelativeTime(todo.createdAt);

    metaDiv.appendChild(priorityBadge);
    metaDiv.appendChild(timeSpan);

    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(metaDiv);

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.id = `edit-btn-${todo.id}`;
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.title = 'Edit task';
    editBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => enableInlineEdit(todo, titleSpan));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.id = `delete-btn-${todo.id}`;
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.title = 'Delete task';
    deleteBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(todo.id, li));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkboxBtn);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    todoList.appendChild(li);
  });
}

// Inline edit mode helper
function enableInlineEdit(todo, titleElement) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-edit-input';
  input.value = todo.title;
  input.maxLength = 150;

  titleElement.replaceWith(input);
  input.focus();
  input.select();

  let isCommitted = false;

  const commitChange = () => {
    if (isCommitted) return;
    isCommitted = true;
    updateTaskTitle(todo.id, input.value);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      commitChange();
    } else if (e.key === 'Escape') {
      isCommitted = true;
      renderTodos();
    }
  });

  input.addEventListener('blur', commitChange);
}

// Helper: Relative time format
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
}

// ==========================================================================
// Toast Notification System
// ==========================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `<span class="toast-icon">${iconSvg}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// ==========================================================================
// Delightful Confetti Cannon
// ==========================================================================

function triggerConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 70;
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}
