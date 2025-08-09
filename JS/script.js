// Ambil elemen
const form = document.getElementById("todo-form");
const list = document.getElementById("todo-list");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const clearBtn = document.getElementById("clear-all");

const totalEl = document.getElementById("total-tasks");
const completedEl = document.getElementById("completed-tasks");
const pendingEl = document.getElementById("pending-tasks");
const progressEl = document.getElementById("progress");

const filterToggle = document.getElementById("filter-toggle");
const filterMenu = document.getElementById("filter-menu");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Render saat pertama load
renderTasks();

// Submit form
form.addEventListener("submit", e => {
  e.preventDefault();
  const taskText = input.value.trim();
  const taskDate = dateInput.value;

  if (taskText === "" || taskDate === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  form.reset();
});

// Render daftar tugas
function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  if (filteredTasks.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4" class="p-4 text-center text-gray-400 text-sm sm:text-base">No tasks found</td>`;
    list.appendChild(row);
    updateStats();
    return;
  }

  filteredTasks.forEach(task => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 text-center text-xs sm:text-sm ${task.completed ? "line-through text-gray-500" : ""}">${task.text}</td>
      <td class="p-3 text-center text-xs sm:text-sm">${task.date}</td>
      <td class="p-3 text-center">
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleStatus(${task.id})">
      </td>
      <td class="p-3 text-center">
        <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700 text-xs sm:text-sm">Delete</button>
      </td>
    `;
    list.appendChild(row);
  });

  updateStats();
}

// Toggle status
function toggleStatus(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// Hapus satu tugas
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Update statistik
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalEl.textContent = total;
  completedEl.textContent = completed;
  pendingEl.textContent = pending;
  progressEl.textContent = progress + "%";
}

// Hapus semua
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Filter menu toggle
filterToggle.addEventListener("click", () => {
  filterMenu.classList.toggle("hidden");
});

// Pilih filter
filterMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
    filterMenu.classList.add("hidden");
  });
});

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}