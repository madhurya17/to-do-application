document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
    updateTodoCount();
});


const addTodoBtn = document.getElementById('addTodo');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const todoCount = document.getElementById('todoCount');


function setupEventListeners() {
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTodos(btn.dataset.filter);
        });
    });
}


function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        displayTodo(todo);
        saveTodoToLocal(todo);
        todoInput.value = '';
        todoInput.focus();
        updateTodoCount();
    }
}

function displayTodo(todo) {
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.dataset.id = todo.id;

    todoItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
        <div class="todo-actions">
            <button class="btn btn-edit"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-delete"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `;

   
    const checkbox = todoItem.querySelector('.todo-checkbox');
    const editBtn = todoItem.querySelector('.btn-edit');
    const deleteBtn = todoItem.querySelector('.btn-delete');

    checkbox.addEventListener('change', () => {
        toggleComplete(todo.id);
        updateTodoCount();
    });
    editBtn.addEventListener('click', () => editTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(todoItem);
}

function toggleComplete(todoId) {
    const todos = getTodosFromLocal();
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        saveAllTodos(todos);
        renderTodos();
    }
}

function editTodo(todoId) {
    const todos = getTodosFromLocal();
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
        const newText = prompt('Edit your todo:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            saveAllTodos(todos);
            renderTodos();
        }
    }
}

function deleteTodo(todoId) {
    let todos = getTodosFromLocal();
    todos = todos.filter(t => t.id !== todoId);
    saveAllTodos(todos);


    const todoItem = document.querySelector(`.todo-item[data-id="${todoId}"]`);
    if (todoItem) {
        todoItem.remove();
    }
}

function filterTodos(filter) {
    const todos = getTodosFromLocal();
    let filteredTodos = todos;
    
    if (filter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (filter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    renderTodos(filteredTodos);
    updateTodoCount();
}

function updateTodoCount() {
    const todos = getTodosFromLocal();
    const activeCount = todos.filter(t => !t.completed).length;
    const totalCount = todos.length;
    
    todoCount.textContent = `${activeCount} active / ${totalCount} total`;
}


function saveTodoToLocal(todo) {
    const todos = getTodosFromLocal();
    todos.push(todo);
    saveAllTodos(todos);
}

function saveAllTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocal() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function loadTodos() {
    const todos = getTodosFromLocal();
    renderTodos(todos);
}

function renderTodos(todos = getTodosFromLocal()) {
    todoList.innerHTML = '';
    todos.forEach(todo => displayTodo(todo));
}
