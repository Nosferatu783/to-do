// Determine API base URL dynamically
const API_BASE_URL = `https://to-do-oxeu.onrender.com/api`;

// Select elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const todoForm = document.getElementById('todo-form');
const todoSection = document.getElementById('todo-section');
const authSection = document.getElementById('auth-section');
const todoList = document.getElementById('todo-list');
const showRegisterButton = document.getElementById('show-register');
const showLoginButton = document.getElementById('show-login');

// Toggle forms for login and registration
showRegisterButton.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

showLoginButton.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// User state and authentication token
let authToken = '';

// Register function
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    console.log('Register response:', data);  // Log response for debugging

    if (data.success && data.ok) {
      alert('Registration successful! Please log in.');
      registerForm.reset();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred during registration.');
  }
});

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    console.log('Login response:', data);  // Log response for debugging

    if (data.success) {
      authToken = data.token;
      authSection.style.display = 'none';
      todoSection.style.display = 'block';
      loadTodos();
    } else {
      alert(data.message || 'Login failed.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login.');
  }
});

// Load to-dos
async function loadTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const todos = await response.json();
    todoList.innerHTML = '';
    todos.forEach(todo => renderTodoItem(todo));
  } catch (error) {
    console.error('Error loading todos:', error);
  }
}

// Render a to-do item
function renderTodoItem(todo) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  li.innerHTML = `
    <span ${todo.completed ? 'class="completed"' : ''}>${todo.task}</span>
    <button onclick="toggleComplete('${todo._id}', ${!todo.completed})">${todo.completed ? 'Undo' : 'Done'}</button>
    <button onclick="deleteTodo('${todo._id}')">Delete</button>
  `;
  todoList.appendChild(li);
}

// Add a new to-do
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('new-task').value;

  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ task }),
    });
    const newTodo = await response.json();
    renderTodoItem(newTodo);
    todoForm.reset();
  } catch (error) {
    console.error('Error adding new todo:', error);
  }
});

// Toggle complete status
async function toggleComplete(id, completed) {
  try {
    await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ completed }),
    });
    loadTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
  }
}

// Delete a to-do
async function deleteTodo(id) {
  try {
    await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    loadTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

// Logout
document.getElementById('logout').addEventListener('click', () => {
  authToken = '';
  todoSection.style.display = 'none';
  authSection.style.display = 'block';
  registerForm.style.display = 'none';
  loginForm.style.display = 'none';
});
