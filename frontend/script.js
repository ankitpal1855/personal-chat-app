// ✅ Backend API URL — change this to your Render backend URL
const API_BASE = "https://personal-chat-app-1-xzgl.onrender.com"; // your actual backend URL

// ✅ Users and passwords
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
  loadMessages();
  setInterval(loadMessages, 2000);
}

// 🔹 Load messages from backend
async function loadMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages`);
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
  } catch (err) {
    console.error("Failed to load messages:", err);
  }
}

// 🔹 Send message
async function sendMessage() {
  const msg = document.getElementById("msgInput").value.trim();
  if (!msg) return;

  try {
    await fetch(`${API_BASE}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: displayName, message: msg })
    });

    document.getElementById("msgInput").value = "";
    loadMessages();
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}

// 🔹 Logout
function logout() {
  localStorage.removeItem("chatUser");
  location.reload();
}
