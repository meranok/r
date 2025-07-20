import "./main.css"

const todoInput = document.getElementById('todoInput');
const addTodoButton = document.getElementById('addTodoButton');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const messageBox = document.getElementById('messageBox')
const themeToggle = document.getElementById('themeToggle');

 let todos = [];

  function showMessage(msg) {
    messageBox.textContent = msg;
    messageBox.classList.add('show');
    setTimeout(() => {
    messageBox.classList.remove('show');
  }, 3000); 
 }
  function renderTodos() {
    todoList.innerHTML = ''; 
      if (todos.length === 0) {
          emptyMessage.style.display = 'block'; 
      } else {
         emptyMessage.style.display = 'none'; 
         todos.forEach(todo => {
const listItem = document.createElement('li');
  listItem.className = 'todo-item'; 
  if (todo.isEditing) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;
    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 0);

  
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSaveEdit(todo.id, editInput.value);
        }
    });

    const saveButton = document.createElement('button');
    saveButton.className = 'save-button';
    saveButton.textContent = 'Save';
    saveButton.onclick = () => handleSaveEdit(todo.id, editInput.value);

    listItem.appendChild(editInput);
    listItem.appendChild(saveButton);
} else {
    const todoTextSpan = document.createElement('span');
    todoTextSpan.className = 'todo-text';
    todoTextSpan.textContent = todo.text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.onclick = () => handleEditTodo(todo.id);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => handleDeleteTodo(todo.id);

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    listItem.appendChild(todoTextSpan);
    listItem.appendChild(actionsDiv);
}
todoList.appendChild(listItem);
});
}
}

function handleAddTodo() {
const inputValue = todoInput.value.trim();
if (inputValue !== '') {
const isAnyEditing = todos.some(todo => todo.isEditing);
if (isAnyEditing) {
showMessage('Please save or cancel your current edit before adding a new item.');
return;
}

todos.push({ id: Date.now(), text: inputValue, isEditing: false });
todoInput.value = ''; 
renderTodos(); 
showMessage('To-do item added!');
} else {
showMessage('Please write something to add!');
}
}


function handleEditTodo(id) {
const currentlyEditingTodo = todos.find(todo => todo.isEditing);
if (currentlyEditingTodo && currentlyEditingTodo.id !== id) {

const editInput = todoList.querySelector('.edit-input'); 
if (editInput) {
handleSaveEdit(currentlyEditingTodo.id, editInput.value);
}
}

const updatedTodos = todos.map(todo => {
return todo.id === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false };
});
todos = updatedTodos;
renderTodos();
}

function handleSaveEdit(id, newText) {
const trimmedText = newText.trim();
if (trimmedText !== '') {
todos = todos.map(todo =>
todo.id === id ? { ...todo, text: trimmedText, isEditing: false } : todo
);
renderTodos();
showMessage('To-do item updated!');
} else {
showMessage('To-do item cannot be empty!');
}
}

function handleDeleteTodo(id) {
const isAnyEditing = todos.some(todo => todo.isEditing);
if (isAnyEditing) {
showMessage('Please save or cancel your current edit before deleting an item.');
return;
}

todos = todos.filter(todo => todo.id !== id);
renderTodos(); 
showMessage('To-do item deleted!');
}

function toggleTheme() {
document.body.classList.toggle('light-mode');

if (document.body.classList.contains('light-mode')) {
themeToggle.textContent = '🌙'; 
showMessage('Switched to Light Mode');
} else {
themeToggle.textContent = '☀️'; 
showMessage('Switched to Dark Mode');
}
}

addTodoButton.addEventListener('click', handleAddTodo);
todoInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
handleAddTodo();
}
});
themeToggle.addEventListener('click', toggleTheme);



document.addEventListener('DOMContentLoaded', () => {
renderTodos();
});

  