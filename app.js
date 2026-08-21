const PRODUCT_CATEGORIES = {
  "flow-meter": {
    name: "Flow Meter",
    products: [
      "Supcon Electro Magnetic Flow Meter",
      "Flange Remote Head 89 Electromagnetic Flow Meter",
      "Vortex Flow Meter",
    ],
  },
  "paperless-recorder": {
    name: "Paperless Recorder",
    products: [
      "Supcon R 5000 Paperless Recorder",
      "Supcon R1000 Laboratory Paperless Recorder",
    ],
  },
  "dcs-panel": {
    name: "DCS Panel",
    products: ["5000 KVA Control JX300 DCS Panel", "Dcs Control Panel"],
  },
  "pressure-transmitter": {
    name: "Pressure Transmitter",
    products: ["Transmitter Module", "30 VDC Pressure Transmitter"],
  },
  "radar-level-transmitter": {
    name: "Radar Level Transmitter",
    products: ["Radar Level Transmitter"],
  },
  "temperature-controller": {
    name: "Temperature Controller",
    products: ["Temperature Controller Batch Control System"],
  },
  "source-meter": {
    name: "Source Meter",
    products: ["Supcon X229 Source Meter"],
  },
};

const MODULES = {
  broker: {
    title: "Broker",
    description:
      "Browse broker product categories for metering, recording, and transmitter sales.",
    categories: [
      "flow-meter",
      "paperless-recorder",
      "pressure-transmitter",
      "radar-level-transmitter",
    ],
  },
  customer: {
    title: "Customer",
    description:
      "Explore customer-facing instruments for flow, level, temperature, and pressure.",
    categories: [
      "flow-meter",
      "radar-level-transmitter",
      "temperature-controller",
      "pressure-transmitter",
    ],
  },
  "service-provider": {
    title: "Service Provider",
    description:
      "Review service-provider equipment for DCS panels, source meters, and control systems.",
    categories: [
      "dcs-panel",
      "source-meter",
      "temperature-controller",
      "paperless-recorder",
    ],
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
const categoryGrid = document.getElementById("category-grid");
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

function renderCategories(categoryIds) {
  categoryGrid.innerHTML = categoryIds
    .map((id) => {
      const category = PRODUCT_CATEGORIES[id];
      if (!category) return "";

      const productsHtml = category.products
        .map(
          (product) => `
            <li>
              <button
                type="button"
                class="text-left text-sm text-leaf-800 transition hover:text-leaf-600"
              >
                ${product}
              </button>
            </li>`
        )
        .join("");

      return `
        <article class="min-w-0">
          <h3 class="font-display text-base font-semibold text-leaf-950">
            ${category.name}
          </h3>
          <ul class="mt-3 space-y-2">
            ${productsHtml}
          </ul>
          <button
            type="button"
            class="mt-3 text-sm font-medium text-leaf-600 transition hover:text-leaf-800"
          >
            ...more
          </button>
        </article>`;
    })
    .join("");
}

function selectModule(key) {
  const module = MODULES[key];
  if (!module) return;

  moduleTitle.textContent = module.title;
  moduleDescription.textContent = module.description;
  renderCategories(module.categories);

  modulePanel.classList.remove("animate-slide-in");
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
