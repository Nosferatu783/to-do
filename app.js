document.addEventListener('DOMContentLoaded', function() {
    const authSection = document.getElementById('auth-section');
    const todoSection = document.getElementById('todo-section');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addTodoBtn = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');

    let token = localStorage.getItem('token');

    const apiUrl = 'https://to-do-oxeu.onrender.com';
    
    registerBtn.addEventListener('click', registerUser);
    loginBtn.addEventListener('click', loginUser);
    
    
    function showAuthSection() {
        authSection.style.display = 'block';
        todoSection.style.display = 'none';
    }

    function showTodoSection() {
        authSection.style.display = 'none';
        todoSection.style.display = 'block';
    }

    // Check if token is present on load
    if (token) {
        loadTodos();
    } else {
        showAuthSection();
    }

    // Login event
    //loginBtn.addEventListener('click', async function() {
    async function loginUser(event) {
        event.preventDefault(); //prevent page from refreshing
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            alert('User login successfull!');
            localStorage.setItem('token', result.token);
            token = result.token;
            loadTodos();
        } else {
            alert('Registration failed: ' + result.message);
            document.getElementById('auth-msg').innerText = result.message;
        }
        } catch (err) {
            alert('Oop an error occured: ' + err.message);
        }
    });

    // Register event
    //registerBtn.addEventListener('click', async function() {
    async function registerUser(event) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        document.getElementById('auth-msg').innerText = result.message;
        if (result.success) {
            alert('User registered successully!');
        } else {
            alert('Registration failed: ' + result.message);
        }
        } catch (err) {
            alert('Ooops an error occured: ' err.message);
        }
    });

    // Add Todo
    addTodoBtn.addEventListener('click', async function() {
        const todoText = document.getElementById('new-todo').value;
        const response = await fetch(`${apiUrl}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: todoText })
        });

        loadTodos();
    });

    // Load Todos
    async function loadTodos() {
        const response = await fetch(`${apiUrl}/todos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const todos = await response.json();
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerText = todo.text;
            todoList.appendChild(li);
        });

        showTodoSection();
    }

    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        token = null;
        showAuthSection();
    });
});

