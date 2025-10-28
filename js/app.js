// Twig Ticket Management App

let currentPage = "landing";
let isLogin = true;
let form = { email: "", password: "" };
let errors = {};
let tickets = [];
let editingTicket = null;

// Templates loaded from .twig files
let templates = {};

async function init() {
  await loadTemplates();
  loadTickets();
  renderPage();
}

function renderPage() {
  const content = document.getElementById("content");
  const template = Twig.twig({ data: templates[currentPage] });

  let data = {};

  switch (currentPage) {
    case "landing":
      data = {};
      break;
    case "auth":
      data = { isLogin, form, errors };
      break;
    case "dashboard":
      data = { stats: getStats() };
      break;
    case "tickets":
      data = { tickets, errors };
      break;
  }

  content.innerHTML = template.render(data);
  attachEventListeners();
}

function attachEventListeners() {
  switch (currentPage) {
    case "auth":
      document
        .getElementById("authForm")
        .addEventListener("submit", handleAuth);
      break;
    case "tickets":
      document
        .getElementById("ticketForm")
        .addEventListener("submit", handleTicketSubmit);
      break;
  }
}

function navigateTo(page) {
  if (page === "dashboard" || page === "tickets") {
    if (!isAuthenticated()) {
      navigateTo("auth");
      return;
    }
  }
  currentPage = page;
  renderPage();
}

function toggleMode() {
  isLogin = !isLogin;
  errors = {};
  renderPage();
}

function handleAuth(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  form.email = formData.get("email");
  form.password = formData.get("password");

  errors = {};
  if (!form.email) errors.email = "Email is required";
  if (!form.password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    renderPage();
    return;
  }

  const result = isLogin
    ? login(form.email, form.password)
    : signup(form.email, form.password);

  if (result.success) {
    showToast("success", isLogin ? "Login successful" : "Signup successful");
    navigateTo("dashboard");
  } else {
    showToast("error", result.error);
  }
}

function showCreateForm() {
  document.getElementById("createForm").style.display = "block";
  editingTicket = null;
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").value = "open";
}

function hideCreateForm() {
  document.getElementById("createForm").style.display = "none";
}

function handleTicketSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const ticketData = {
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  };

  errors = {};
  if (!ticketData.title) errors.title = "Title is required";
  if (!["open", "in_progress", "closed"].includes(ticketData.status)) {
    errors.status = "Invalid status";
  }

  if (Object.keys(errors).length > 0) {
    renderPage();
    return;
  }

  if (editingTicket) {
    updateTicket(editingTicket, ticketData);
    showToast("success", "Ticket updated successfully");
  } else {
    createTicket(ticketData);
    showToast("success", "Ticket created successfully");
  }

  hideCreateForm();
  renderPage();
}

function editTicket(id) {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    editingTicket = id;
    showCreateForm();
    document.getElementById("title").value = ticket.title;
    document.getElementById("description").value = ticket.description;
    document.getElementById("status").value = ticket.status;
  }
}

function deleteTicket(id) {
  if (confirm("Are you sure you want to delete this ticket?")) {
    tickets = tickets.filter((t) => t.id !== id);
    saveTickets();
    showToast("success", "Ticket deleted successfully");
    renderPage();
  }
}

function logout() {
  localStorage.removeItem("ticketapp_session");
  navigateTo("landing");
}

function showToast(type, message) {
  // Simple toast implementation
  alert(message);
}

// Auth functions
function login(email, password) {
  // Simulate login - in real app, this would be an API call
  if (email && password) {
    localStorage.setItem("ticketapp_session", "authenticated");
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

function signup(email, password) {
  // Simulate signup
  if (email && password) {
    localStorage.setItem("ticketapp_session", "authenticated");
    return { success: true };
  }
  return { success: false, error: "Signup failed" };
}

function isAuthenticated() {
  return localStorage.getItem("ticketapp_session") === "authenticated";
}

// Ticket functions
function loadTickets() {
  const stored = localStorage.getItem("tickets");
  tickets = stored ? JSON.parse(stored) : [];
}

function saveTickets() {
  localStorage.setItem("tickets", JSON.stringify(tickets));
}

function createTicket(data) {
  const ticket = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  saveTickets();
}

function updateTicket(id, data) {
  const index = tickets.findIndex((t) => t.id === id);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...data };
    saveTickets();
  }
}

function getStats() {
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}

// Load templates from .twig files
async function loadTemplates() {
  const templateNames = ["landing", "auth", "dashboard", "tickets"];
  for (const name of templateNames) {
    const response = await fetch(`templates/${name}.twig`);
    templates[name] = await response.text();
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", init);
