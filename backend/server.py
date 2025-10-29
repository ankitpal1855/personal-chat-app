from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Get DATABASE_URL from environment variable
DATABASE_URL = os.environ.get("postgresql://chat_db_uxor_user:6EUCuyPfnWUWLrIDTpF6sC7i0cnI2aOz@dpg-d40svvfdiees73ajijsg-a/chat_db_uxor")

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

# 🟢 Test route
@app.route("/")
def home():
    return "Chat backend is running!"

# 🟢 Get all messages
@app.route("/messages", methods=["GET"])
def get_messages():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM messages ORDER BY timestamp ASC;")
    messages = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(messages)

# 🟢 Add new message
@app.route("/messages", methods=["POST"])
def add_message():
    data = request.get_json()
    name = data["name"]
    message = data["message"]
    timestamp = datetime.now()

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO messages (name, message, timestamp) VALUES (%s, %s, %s);",
        (name, message, timestamp),
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
