const cars = [
  {
    id: "sentinel",
    name: "Sentinel XR",
    tagline: "Tri-motor hyper GT",
    basePrice: 168000,
    range: 410,
    zeroToSixty: 2.4,
    horsepower: 980,
    images: {
      Onyx: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      Glacier: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
      Ember: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "aurelia",
    name: "Aurelia S5",
    tagline: "Grand touring fastback",
    basePrice: 124000,
    range: 380,
    zeroToSixty: 3.2,
    horsepower: 760,
    images: {
      Onyx: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      Glacier: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      Ember: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "vertex",
    name: "Vertex RS",
    tagline: "Rally sport crossover",
    basePrice: 98000,
    range: 340,
    zeroToSixty: 3.8,
    horsepower: 640,
    images: {
      Onyx: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      Glacier: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      Ember: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=1200&q=80",
    },
  },
];

const wheelPackages = [
  { name: "Aero 20\"", price: 0, rangeBoost: 8 },
  { name: "Forged 21\"", price: 4200, rangeBoost: 2 },
  { name: "Track 22\"", price: 7800, rangeBoost: -6 },
];

const powertrains = [
  { name: "Dual-motor", price: 0, hpBoost: 0, zeroToSixty: 0 },
  { name: "Tri-motor", price: 12000, hpBoost: 120, zeroToSixty: -0.3 },
  { name: "Quad-motor", price: 24000, hpBoost: 240, zeroToSixty: -0.6 },
];

const modelGrid = document.getElementById("modelGrid");
const modelSelect = document.getElementById("modelSelect");
const colorSelect = document.getElementById("colorSelect");
const wheelSelect = document.getElementById("wheelSelect");
const powerSelect = document.getElementById("powerSelect");
const customizerImage = document.getElementById("customizerImage");
const customizerPrice = document.getElementById("customizerPrice");
const specList = document.getElementById("specList");
const scrollCustomizer = document.getElementById("scrollCustomizer");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginStatus = document.getElementById("loginStatus");

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function renderModels() {
  modelGrid.innerHTML = "";
  cars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "card";
    const imageUrl = car.images.Onyx;
    card.innerHTML = `
      <span class="badge">${car.tagline}</span>
      <img src="${imageUrl}" alt="${car.name}" />
      <h3>${car.name}</h3>
      <p>${car.range} mi range · ${car.zeroToSixty}s 0-60 · ${car.horsepower} hp</p>
      <p>Starting at ${formatter.format(car.basePrice)}</p>
    `;
    modelGrid.appendChild(card);
  });
}

function populateSelects() {
  modelSelect.innerHTML = cars
    .map((car) => `<option value="${car.id}">${car.name}</option>`)
    .join("");

  colorSelect.innerHTML = ["Onyx", "Glacier", "Ember"]
    .map((color) => `<option value="${color}">${color}</option>`)
    .join("");

  wheelSelect.innerHTML = wheelPackages
    .map((wheel, index) => `<option value="${index}">${wheel.name}</option>`)
    .join("");

  powerSelect.innerHTML = powertrains
    .map((power, index) => `<option value="${index}">${power.name}</option>`)
    .join("");
}

function getCurrentConfig() {
  const car = cars.find((item) => item.id === modelSelect.value) || cars[0];
  const color = colorSelect.value;
  const wheel = wheelPackages[Number(wheelSelect.value)];
  const power = powertrains[Number(powerSelect.value)];

  const price = car.basePrice + wheel.price + power.price;
  const horsepower = car.horsepower + power.hpBoost;
  const range = car.range + wheel.rangeBoost;
  const zeroToSixty = Math.max(1.9, car.zeroToSixty + power.zeroToSixty);

  return { car, color, wheel, power, price, horsepower, range, zeroToSixty };
}

function updateCustomizer() {
  const config = getCurrentConfig();
  customizerImage.src = config.car.images[config.color];
  customizerPrice.textContent = formatter.format(config.price);
  specList.innerHTML = `
    <div><strong>Model:</strong> ${config.car.name}</div>
    <div><strong>Color:</strong> ${config.color} Metallic</div>
    <div><strong>Wheels:</strong> ${config.wheel.name}</div>
    <div><strong>Powertrain:</strong> ${config.power.name}</div>
    <div><strong>Est. range:</strong> ${config.range} miles</div>
    <div><strong>0-60 mph:</strong> ${config.zeroToSixty.toFixed(1)} seconds</div>
    <div><strong>Output:</strong> ${config.horsepower} hp</div>
  `;
}

function addChatBubble(text, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function generateResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("price") || lower.includes("cost")) {
    return `Our builds range from ${formatter.format(cars[2].basePrice)} to ${formatter.format(
      cars[0].basePrice + 24000
    )}. Tell me which model you want to price.`;
  }
  if (lower.includes("range") || lower.includes("battery")) {
    return "Current prototypes deliver 340-410 miles of EPA-estimated range depending on wheels and powertrain.";
  }
  if (lower.includes("delivery") || lower.includes("ship")) {
    return "First concierge deliveries are scheduled 6-8 months after reservation with real-time status updates.";
  }
  if (lower.includes("sentinel")) {
    return "Sentinel XR is our tri-motor flagship: 980 hp, 2.4s 0-60, and 410 miles of range.";
  }
  if (lower.includes("aurelia")) {
    return "Aurelia S5 balances comfort and speed with 760 hp, 380 miles of range, and a panoramic fastback cabin.";
  }
  if (lower.includes("vertex")) {
    return "Vertex RS is engineered for adventure: 640 hp, adaptive rally suspension, and 340 miles of range.";
  }
  if (lower.includes("custom") || lower.includes("color")) {
    return "Choose Onyx, Glacier, or Ember paint, then select wheels and powertrain. Each selection updates the render in real time.";
  }
  return "I can help you configure a build, compare trims, or schedule a concept drive. What would you like to explore?";
}

function initChat() {
  addChatBubble("Welcome to Halcyon AI. Ask me about specs, pricing, or delivery timelines.");
}

function getStoredUsers() {
  const raw = localStorage.getItem("halcyonUsers");
  return raw ? JSON.parse(raw) : [];
}

function setStoredUsers(users) {
  localStorage.setItem("halcyonUsers", JSON.stringify(users));
}

function updateLoginStatus(user) {
  if (user) {
    loginStatus.textContent = `Logged in as ${user.name}`;
  } else {
    loginStatus.textContent = "";
  }
}

scrollCustomizer.addEventListener("click", () => {
  document.getElementById("customizer").scrollIntoView({ behavior: "smooth" });
});

[modelSelect, colorSelect, wheelSelect, powerSelect].forEach((element) => {
  element.addEventListener("change", updateCustomizer);
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  addChatBubble(message, "user");
  chatInput.value = "";
  setTimeout(() => {
    addChatBubble(generateResponse(message));
  }, 500);
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const users = getStoredUsers();
  if (users.some((user) => user.email === email)) {
    signupMessage.textContent = "An account with that email already exists.";
    return;
  }
  const newUser = { name, email, password };
  users.push(newUser);
  setStoredUsers(users);
  signupMessage.textContent = "Account created. You can log in now.";
  signupForm.reset();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const users = getStoredUsers();
  const user = users.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    loginMessage.textContent = "Invalid email or password.";
    updateLoginStatus(null);
    return;
  }
  loginMessage.textContent = "Login successful. Welcome back.";
  updateLoginStatus(user);
  loginForm.reset();
});

renderModels();
populateSelects();
updateCustomizer();
initChat();
