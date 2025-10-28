// Twig Ticket Management App

let currentPage = 'landing';
let isLogin = true;
let form = { email: '', password: '' };
let errors = {};
let tickets = [];
let editingTicket = null;

// Embedded templates
const templates = {
  landing: `
<div class="hero">
  <div class="container">
    <div class="hero-content">
      <h1>Ticket Management System</h1>
      <p>Streamline your support workflow with our comprehensive ticket management solution.</p>
      <div class="cta-buttons">
        <button class="btn btn-primary" onclick="navigateTo('auth')">Login</button>
        <button class="btn btn-secondary" onclick="navigateTo('auth')">Get Started</button>
      </div>
    </div>
  </div>
  <div class="wave"></div>
  <div class="circle circle1"></div>
  <div class="circle circle2"></div>
</div>

<section class="section">
  <div class="container">
    <div class="grid">
      <div class="card">
        <h3>Easy Ticket Creation</h3>
        <p>Create and manage support tickets effortlessly.</p>
      </div>
      <div class="card">
        <h3>Real-time Updates</h3>
        <p>Stay updated with instant notifications and status changes.</p>
      </div>
      <div class="card">
        <h3>Comprehensive Dashboard</h3>
        <p>View all your tickets and statistics in one place.</p>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>&copy; 2025 Ticket Management App. All rights reserved.</p>
  </div>
</footer>
`,
  auth: `
<div class="container">
  <div class="card" style="max-width: 400px; margin: 50px auto;">
    <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
    <form id="authForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value="{{ form.email }}" required />
        {% if errors.email %}
          <div class="error">{{ errors.email }}</div>
        {% endif %}
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" value="{{ form.password }}" required />
        {% if errors.password %}
          <div class="error">{{ errors.password }}</div>
        {% endif %}
      </div>
      <button type="submit" class="btn btn-primary">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
    </form>
    <p style="text-align: center; margin-top: 20px;">
      {{ isLogin ? 'Don\'t have an account?' : 'Already have an account?' }}
      <a href="#" onclick="toggleMode()">{{ isLogin ? 'Sign Up' : 'Login' }}</a>
    </p>
    <p style="text-align: center; margin-top: 20px;">
      <a href="#" onclick="navigateTo('landing')">Back to Home</a>
    </p>
  </div>
</div>
`,
  dashboard: `
<div class="container">
  <h1>Dashboard</h1>
  <div class="grid" style="margin-bottom: 30px;">
    <div class="card">
      <h3>Total Tickets</h3>
      <p style="font-size: 2rem; font-weight: bold;">{{ stats.total }}</p>
    </div>
    <div class="card">
      <h3>Open Tickets</h3>
      <p style="font-size: 2rem; font-weight: bold; color: #27ae60;">{{ stats.open }}</p>
    </div>
    <div class="card">
      <h3>Closed Tickets</h3>
      <p style="font-size: 2rem; font-weight: bold; color: #95a5a6;">{{ stats.closed }}</p>
    </div>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <button class="btn btn-primary" onclick="navigateTo('tickets')">Manage Tickets</button>
    <button class="btn btn-secondary" onclick="logout()">Logout</button>
  </div>
</div>
`,
  tickets: `
<div class="container">
  <h1>Ticket Management</h1>
  <button class="btn btn-primary" onclick="showCreateForm()">Create New Ticket</button>
  <button class="btn btn-secondary" onclick="navigateTo('dashboard')">Back to Dashboard</button>

  <div id="createForm" style="display: none; margin-top: 20px;">
    <div class="card">
      <h3>Create Ticket</h3>
      <form id="ticketForm">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" name="title" type="text" required />
          {% if errors.title %}
            <div class="error">{{ errors.title }}</div>
          {% endif %}
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description"></textarea>
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" name="status" required>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
        <button type="button" class="btn btn-secondary" onclick="hideCreateForm()">Cancel</button>
      </form>
    </div>
  </div>

  <div class="grid" style="margin-top: 20px;">
    {% for ticket in tickets %}
    <div class="card">
      <h3>{{ ticket.title }}</h3>
      <p>{{ ticket.description }}</p>
      <p class="status-{{ ticket.status }}">{{ ticket.status | replace({'_': ' '}) | title }}</p>
      <div>
        <button class="btn btn-primary" onclick="editTicket({{ ticket.id }})">Edit</button>
        <button class="btn btn-secondary" onclick="deleteTicket({{ ticket.id }})">Delete</button>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
`
};

function init() {
  loadTickets();
  renderPage();
}

function renderPage() {
  const content = document.getElementById('content');
  const template = Twig.twig({ data: templates[currentPage] });

  let data = {};

  switch (currentPage) {
    case 'landing':
      data = {};
      break;
    case 'auth':
      data = { isLogin, form, errors };
      break;
    case 'dashboard':
      data = { stats: getStats() };
      break;
    case 'tickets':
      data = { tickets, errors };
      break;
  }

  content.innerHTML = template.render(data);
  attachEventListeners();
}

function attachEventListeners() {
  switch (currentPage) {
    case 'auth':
      document.getElementById('authForm').addEventListener('submit', handleAuth);
      break;
    case 'tickets':
      document.getElementById('ticketForm').addEventListener('submit', handleTicketSubmit);
      break;
  }
}

function navigateTo(page) {
  if (page === 'dashboard' || page === 'tickets') {
    if (!isAuthenticated()) {
      navigateTo('auth');
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
  form.email = formData.get('email');
  form.password = formData.get('password');

  errors = {};
  if (!form.email) errors.email = 'Email is required';
  if (!form.password) errors.password = 'Password is required';

  if (Object.keys(errors).length > 0) {
    renderPage();
    return;
  }

  const result = isLogin ? login(form.email, form.password) : signup(form.email, form.password);

  if (result.success) {
    showToast('success', isLogin ? 'Login successful' : 'Signup successful');
    navigateTo('dashboard');
  } else {
    showToast('error', result.error);
  }
}

function showCreateForm() {
  document.getElementById('createForm').style.display = 'block';
  editingTicket = null;
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('status').value = 'open';
}

function hideCreateForm() {
  document.getElementById('createForm').style.display = 'none';
}

function handleTicketSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const ticketData = {
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status')
  };

  errors = {};
  if (!ticketData.title) errors.title = 'Title is required';
  if (!['open', 'in_progress', 'closed'].includes(ticketData.status)) {
    errors.status = 'Invalid status';
  }

  if (Object.keys(errors).length > 0) {
    renderPage();
    return;
  }

  if (editingTicket) {
    updateTicket(editingTicket, ticketData);
    showToast('success', 'Ticket updated successfully');
  } else {
    createTicket(ticketData);
    showToast('success', 'Ticket created successfully');
  }

  hideCreateForm();
  renderPage();
}

function editTicket(id) {
  const ticket = tickets.find(t => t.id === id);
  if (ticket) {
    editingTicket = id;
    showCreateForm();
    document.getElementById('title').value = ticket.title;
    document.getElementById('description').value = ticket.description;
    document.getElementById('status').value = ticket.status;
  }
}

function deleteTicket(id) {
  if (confirm('Are you sure you want to delete this ticket?')) {
    tickets = tickets.filter(t => t.id !== id);
    saveTickets();
    showToast('success', 'Ticket deleted successfully');
    renderPage();
  }
}

function logout() {
  localStorage.removeItem('ticketapp_session');
  navigateTo('landing');
}

function showToast(type, message) {
  // Simple toast implementation
  alert(message);
}

// Auth functions
function login(email, password) {
  // Simulate login - in real app, this would be an API call
  if (email && password) {
    localStorage.setItem('ticketapp_session', 'authenticated');
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
}

function signup(email, password) {
  // Simulate signup
  if (email && password) {
    localStorage.setItem('ticketapp_session', 'authenticated');
    return { success: true };
  }
  return { success: false, error: 'Signup failed' };
}

function isAuthenticated() {
  return localStorage.getItem('ticketapp_session') === 'authenticated';
}

// Ticket functions
function loadTickets() {
  const stored = localStorage.getItem('tickets');
  tickets = stored ? JSON.parse(stored) : [];
}

function saveTickets() {
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function createTicket(data) {
  const ticket = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString()
  };
  tickets.push(ticket);
  saveTickets();
}

function updateTicket(id, data) {
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...data };
    saveTickets();
  }
}

function getStats() {
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);
