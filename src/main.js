import "./main.css";

const els = {
  todoInput: document.getElementById("todoInput"),
  addBtn: document.getElementById("addTodoButton"),
  todoList: document.getElementById("todoList"),
  emptyMsg: document.getElementById("emptyMessage"),
  msgBox: document.getElementById("messageBox"),
  themeToggle: document.getElementById("themeToggle"),
};

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let theme = localStorage.getItem("theme") || "dark";

// === UTILITIES ===
function saveState() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showMessage(msg) {
  els.msgBox.textContent = msg;
  els.msgBox.classList.add("show");
  setTimeout(() => els.msgBox.classList.remove("show"), 3000);
}

function setTheme(mode) {
  document.body.classList.toggle("light-mode", mode === "light");
  els.themeToggle.textContent = mode === "light" ? "🌙" : "☀️";
  localStorage.setItem("theme", mode);
}

function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  setTheme(theme);
  showMessage(`Switched to ${theme === "light" ? "Light" : "Dark"} Mode`);
}

// === RENDER ===
function renderTodos() {
  els.todoList.innerHTML = "";
  if (!todos.length) {
    els.emptyMsg.style.display = "block";
    return;
  }
  els.emptyMsg.style.display = "none";

  const fragment = document.createDocumentFragment();
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    if (todo.isEditing) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "edit-input";
      input.value = todo.text;
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSaveEdit(todo.id, input.value);
        if (e.key === "Escape") cancelEdit(todo.id);
      });
      input.focus();

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-button";
      saveBtn.textContent = "Save";
      saveBtn.onclick = () => handleSaveEdit(todo.id, input.value);

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-button";
      cancelBtn.textContent = "Cancel";
      cancelBtn.onclick = () => cancelEdit(todo.id);

      li.append(input, saveBtn, cancelBtn);
    } else {
      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;

      const actions = document.createElement("div");
      actions.className = "todo-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-button";
      editBtn.textContent = "Edit";
      editBtn.onclick = () => handleEdit(todo.id);

      const delBtn = document.createElement("button");
      delBtn.className = "delete-button";
      delBtn.textContent = "Delete";
      delBtn.onclick = () => handleDelete(todo.id);

      actions.append(editBtn, delBtn);
      li.append(span, actions);
    }
    fragment.appendChild(li);
  });
  els.todoList.appendChild(fragment);
}

// === ACTIONS ===
function handleAdd() {
  const text = els.todoInput.value.trim();
  if (!text) return showMessage("Please write something to add!");

  if (todos.some((t) => t.isEditing))
    return showMessage("Finish editing before adding new item.");

  todos.push({ id: Date.now(), text, isEditing: false });
  els.todoInput.value = "";
  saveState();
  renderTodos();
  showMessage("To-do item added!");
}

function handleEdit(id) {
  todos = todos.map((t) => ({ ...t, isEditing: t.id === id }));
  renderTodos();
}

function handleSaveEdit(id, text) {
  const trimmed = text.trim();
  if (!trimmed) return showMessage("To-do item cannot be empty!");
  todos = todos.map((t) =>
    t.id === id ? { ...t, text: trimmed, isEditing: false } : t
  );
  saveState();
  renderTodos();
  showMessage("To-do item updated!");
}

function cancelEdit(id) {
  todos = todos.map((t) => ({ ...t, isEditing: false }));
  renderTodos();
}

function handleDelete(id) {
  if (todos.some((t) => t.isEditing))
    return showMessage("Finish editing before deleting.");

  todos = todos.filter((t) => t.id !== id);
  saveState();
  renderTodos();
  showMessage("To-do item deleted!");
}

// === EVENT BINDINGS ===
els.addBtn.addEventListener("click", handleAdd);
els.todoInput.addEventListener(
  "keypress",
  (e) => e.key === "Enter" && handleAdd()
);
els.themeToggle.addEventListener("click", toggleTheme);

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
  setTheme(theme);
  renderTodos();
});
