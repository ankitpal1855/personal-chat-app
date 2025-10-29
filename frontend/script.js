// ✅ Backend URL (auto-switch for local or Render)
const API_URL = window.location.hostname.includes("127.0.0.1")
  ? "http://127.0.0.1:5000"
  : "https://personal-chat-app-1-xzgl.onrender.com";

// ✅ Users, Passwords, and Display Nicknames
const USERS = {
  "ankit": { password: "pass123", nickname: "Anki" },
  "rishi": { password: "rishi321", nickname: "RishMan" },
  "arjun": { password: "arjun999", nickname: "AJ" }
};

let currentUser = "";
let displayName = "";

// 🔹 Check localStorage on load
window.onload = () => {
  const savedUser = localStorage.getItem("chatUser");
  const savedNickname = localStorage.getItem("chatNickname");
  if (savedUser && USERS[savedUser]) {
    currentUser = savedUser;
    displayName = savedNickname;
    showChat();
  }
};

// 🔹 Handle login
function login() {
  const name = document.getElementById("name").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (!USERS[name] || USERS[name].password !== password) {
    error.textContent = "Invalid username or password!";
    return;
  }

  currentUser = name;
  displayName = USERS[name].nickname;
  localStorage.setItem("chatUser", currentUser);
  localStorage.setItem("chatNickname", displayName);
  showChat();
}

// 🔹 Show chat and load messages
function showChat() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("chatBox").classList.remove("hidden");
  displayName = localStorage.getItem("chatNickname") || displayName;
  loadMessages();
  setInterval(loadMessages, 2000);
}

// 🔹 Load messages from backend
async function loadMessages() {
  const res = await fetch(`${API_URL}/messages`);
  const data = await res.json();
  const msgDiv = document.getElementById("messages");
  msgDiv.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("msg");
    if (m.name === displayName) {
      div.style.fontWeight = "bold";
      div.style.color = "blue";
    }
    div.textContent = `[${m.timestamp}] ${m.name}: ${m.message}`;
    msgDiv.appendChild(div);
  });

  msgDiv.scrollTop = msgDiv.scrollHeight;
}

// 🔹 Send a message
async function sendMessage() {
  const msg = document.getElementById("msgInput").value.trim();
  if (!msg) return;

  await fetch(`${API_URL}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: displayName, message: msg })
  });

  document.getElementById("msgInput").value = "";
  loadMessages();
}

// 🔹 Logout
function logout() {
  localStorage.removeItem("chatUser");
  localStorage.removeItem("chatNickname");
  location.reload();
}
