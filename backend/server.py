from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import psycopg2
from datetime import datetime

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return render_template("index.html")


# 🔹 Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="chatdb",
    user="postgres",
    password="admin9563"
)
cur = conn.cursor()

# 🔹 Create messages table if not exists
cur.execute("""
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name TEXT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")
conn.commit()

# 🔹 Route to get all messages
@app.route("/messages", methods=["GET"])
def get_messages():
    cur.execute("SELECT name, message, timestamp FROM messages ORDER BY id ASC;")
    rows = cur.fetchall()
    return jsonify([
        {"name": r[0], "message": r[1], "timestamp": r[2].strftime("%H:%M:%S")}
        for r in rows
    ])

# 🔹 Route to send a message
@app.route("/send", methods=["POST"])
def send_message():
    data = request.get_json()
    name = data["name"]
    message = data["message"]
    cur.execute("INSERT INTO messages (name, message) VALUES (%s, %s)", (name, message))
    conn.commit()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)
