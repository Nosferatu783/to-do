// When the DOM content is loaded, attach event listeners to the buttons
document.addEventListener('DOMContentLoaded', function () {
    // Buttons to show login and register forms
    const showLoginButton = document.getElementById('show-login');
    const showRegisterButton = document.getElementById('show-register');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const todoSection = document.getElementById('todo-section');
    const authSection = document.getElementById('auth-section');

    // Attach click event listeners to the buttons
    if (showLoginButton) {
        showLoginButton.addEventListener('click', function () {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
    }

    if (showRegisterButton) {
        showRegisterButton.addEventListener('click', function () {
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }

    // Attach the event listener for Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    // Attach the event listener for Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    // Attach the event listener for Add To-Do form submission
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', addTodo);
    }

    // Attach the event listener for Logout button
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    // Automatically fetch to-do list if user is authenticated
    checkAuth();
});

// Register User Function
async function registerUser(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
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
            showToDoList(); // Show to-do list after successful registration
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (err) {
        alert('An error occurred: ' + err.message);
    }
}

// Login User Function
async function loginUser(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
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
            showToDoList(); // Show to-do list after successful login
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (err) {
        alert('An error occurred: ' + err.message);
    }
}

// Fetch To-Do List for Logged-in User
async function getTodos() {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        displayTodos(todos);
    } catch (err) {
        console.error('Failed to fetch to-do list:', err);
    }
}

// Display the To-Do List on the Page
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear any existing list items

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.textContent = `${todo.task} ${todo.completed ? '(Completed)' : ''}`;
        
        // Add buttons for Update and Delete
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateTodo(todo._id, prompt('New Task', todo.task));
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo._id);

        listItem.appendChild(updateButton);
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    });
}

// Add a new To-Do item
async function addTodo(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    const task = document.getElementById('new-task').value;

    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, completed: false })
        });

        const todo = await response.json();
        getTodos(); // Refresh the list after adding
    } catch (err) {
        console.error('Failed to add to-do:', err);
    }
}

// Update a To-Do item
async function updateTodo(id, newTask) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: newTask })
        });

        const updatedTodo = await response.json();
        getTodos(); // Refresh the list after updating
    } catch (err) {
        console.error('Failed to update to-do:', err);
    }
}

// Delete a To-Do item
async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.message) {
            getTodos(); // Refresh the list after deleting
        }
    } catch (err) {
        console.error('Failed to delete to-do:', err);
    }
}

// Show To-Do List and Hide Auth Forms
function showToDoList() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
    getTodos(); // Fetch and display the to-do list
}

// Logout User
function logoutUser() {
    // Clear any session or authentication token if stored
    document.getElement
