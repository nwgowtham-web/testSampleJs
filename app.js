const MODULES = {
  broker: {
    title: "Broker",
    description:
      "Review broker accounts, commissions, and partner activity from this workspace.",
    stat: "128",
  },
  customer: {
    title: "Customer",
    description:
      "Browse customer profiles, service history, and open requests in one place.",
    stat: "2,450",
  },
  "service-provider": {
    title: "Service Provider",
    description:
      "Coordinate provider coverage, availability, and assigned service jobs.",
    stat: "64",
  },
};

const loginView = document.getElementById("login-view");
const appView = document.getElementById("app-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const userChip = document.getElementById("user-chip");
const moduleTitle = document.getElementById("module-title");
const moduleDescription = document.getElementById("module-description");
const moduleStat = document.getElementById("module-stat");
const modulePanel = document.getElementById("module-panel");
const menuItems = document.querySelectorAll(".menu-item");
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

const SESSION_KEY = "verdant_session";

function showError(message) {
  loginError.textContent = message;
  loginError.classList.remove("hidden");
}

function clearError() {
  loginError.textContent = "";
  loginError.classList.add("hidden");
}

function setSidebarOpen(open) {
  sidebar.classList.toggle("-translate-x-full", !open);
  sidebarOverlay.classList.toggle("hidden", !open);
}

function showLogin() {
  loginView.classList.remove("hidden");
  appView.classList.add("hidden");
  setSidebarOpen(false);
}

function showApp(email) {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
  userChip.textContent = email;
  selectModule("broker");
}

function selectModule(key) {
  const module = MODULES[key];
  if (!module) return;

  moduleTitle.textContent = module.title;
  moduleDescription.textContent = module.description;
  moduleStat.textContent = module.stat;

  modulePanel.classList.remove("animate-slide-in");
  // Force reflow so the animation can replay
  void modulePanel.offsetWidth;
  modulePanel.classList.add("animate-slide-in");

  menuItems.forEach((item) => {
    const isActive = item.dataset.module === key;
    item.classList.toggle("menu-active", isActive);
    item.classList.toggle("border-leaf-400", isActive);
    item.classList.toggle("border-transparent", !isActive);
    item.classList.toggle("text-leaf-100", isActive);
    item.classList.toggle("text-leaf-300", !isActive);
  });

  setSidebarOpen(false);
}

function persistSession(email) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function restoreSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    showError("Please enter both email and password.");
    return;
  }

  if (!email.includes("@")) {
    showError("Please enter a valid email address.");
    return;
  }

  persistSession(email);
  showApp(email);
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  loginForm.reset();
  clearError();
  showLogin();
});

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    selectModule(item.dataset.module);
  });
});

menuToggle.addEventListener("click", () => {
  setSidebarOpen(true);
});

sidebarOverlay.addEventListener("click", () => {
  setSidebarOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
  }
});

const existing = restoreSession();
if (existing?.email) {
  showApp(existing.email);
} else {
  showLogin();
}
