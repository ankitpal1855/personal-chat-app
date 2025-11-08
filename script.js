// ✅ Replace this with your actual Render backend URL
const API_BASE = "https://personal-chat-app-1-xzgl.onrender.com";

// ✅ Predefined users
const USERS = {
  "ankit": { password: "pass123", nickname: "goreeb 🥲", email: "ap349500@gmail.com" },
  "anurag": { password: "Anurag@anurag498465", nickname: "Epic Anu 😉", email: "ap349500@gmail.com" },
  "chirag": { password: "Chirag@chirag456456", nickname: "Ansh Badshah 😎", email: "ap349500@gmail.com" }
};

let currentUser = "";
let displayName = "";

// 🔹 Auto-login if user already in localStorage
window.onload = () => {
  const savedUser = localStorage.getItem("chatUser");
  const savedNickname = localStorage.getItem("chatNickname");

  if (savedUser && USERS[savedUser]) {
    currentUser = savedUser;
    displayName = savedNickname;
    showChat();
  }
};

// 🔹 Login
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

// 🔹 Show chat and start refreshing messages
function showChat() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("chatBox").classList.remove("hidden");
  loadMessages();
  setInterval(loadMessages, 2000);
}

// 🔹 Load messages
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
        div.style.color = "lightblue";
      }
      div.textContent = `[${m.timestamp}] ${m.name}: ${m.message}`;
      msgDiv.appendChild(div);
    });

    msgDiv.scrollTop = msgDiv.scrollHeight;
  } catch (err) {
    console.error("Error loading messages:", err);
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
    console.error("Error sending message:", err);
  }
}

// 🔹 Poke Button
async function poke() {
  // Find all users except current one
  const others = Object.keys(USERS).filter(u => u !== currentUser);
  const sender = displayName;

  try {
    await fetch(`${API_BASE}/poke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: others.map(u => USERS[u].email) // send to other two emails
      })
    });

    alert("Poke sent successfully!");
  } catch (err) {
    console.error("Error sending poke:", err);
    alert("Failed to send poke.");
  }
}


// 🔹 Logout
function logout() {
  localStorage.removeItem("chatUser");
  localStorage.removeItem("chatNickname");
  location.reload();
}
