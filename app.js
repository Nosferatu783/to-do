document.addEventListener('DOMContentLoaded', function () {
    const showLoginButton = document.getElementById('show-login');
    const showRegisterButton = document.getElementById('show-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const todoSection = document.getElementById('todo-section');
    const authSection = document.getElementById('auth-section');
    const todoForm = document.getElementById('todo-form');
    const logoutButton = document.getElementById('logout');

    // Show Login form when 'Login' button is clicked
    if (showLoginButton) {
        showLoginButton.addEventListener('click', function () {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }

    // Show Register form when 'Register' button is clicked
    if (showRegisterButton) {
        showRegisterButton.addEventListener('click', function () {
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }

    // Handle Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission refresh
            registerUser();
        });
    }

    // Handle Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission refresh
            loginUser();
        });
    }

    // Handle adding new to-do item
    if (todoForm) {
        todoForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission refresh
            addTodo();
        });
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // Call a function to check if user is already authenticated
    checkAuth();
});

// Register user
async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            alert('User registered successfully!');
            showToDoList(); // Show to-do list section after registration
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred during registration');
    }
}

// Login user
async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            alert('Login successful!');
            showToDoList(); // Show to-do list section after login
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred during login');
    }
}

// Fetch To-Do List
async function getTodos() {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        displayTodos(todos);
    } catch (err) {
        console.error('Failed to fetch to-do list:', err);
    }
}

// Display To-Dos
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = `${todo.task} ${todo.completed ? '(Completed)' : ''}`;
        todoList.appendChild(listItem);
    });
}

// Add To-Do
async function addTodo() {
    const task = document.getElementById('new-task').value;

    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, completed: false })
        });

        if (response.ok) {
            document.getElementById('new-task').value = ''; // Clear the input field
            getTodos(); // Refresh the list
        }
    } catch (err) {
        console.error('Failed to add to-do:', err);
    }
}

// Logout user
function logoutUser() {
    // Logic to log out the user
    alert('User logged out');
    authSection.style.display = 'block';
    todoSection.style.display = 'none';
}

// Show To-Do List after login/register
function showToDoList() {
    authSection.style.display = 'none';
    todoSection.style.display = 'block';
    getTodos(); // Fetch and display the to-do list
}

// Check if user is authenticated (dummy function for now)
function checkAuth() {
    // Logic to check if the user is already logged in (session, token, etc.)
}
