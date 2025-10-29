from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ✅ PostgreSQL connection (Render)
DB_URL = os.getenv("DATABASE_URL", "postgresql://chat_db_uxor_user:6EUCuyPfnWUWLrIDTpF6sC7i0cnI2aOz@dpg-d40svvfdiees73ajijsg-a.oregon-postgres.render.com/chat_db_uxor")

def get_db_connection():
    return psycopg2.connect(DB_URL)

@app.route('/')
def home():
    return "✅ Chat server is running!"

@app.route('/messages', methods=['GET'])
def get_messages():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, message, to_char(timestamp, 'HH24:MI:SS') FROM messages ORDER BY id ASC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    messages = [{"name": r[0], "message": r[1], "timestamp": r[2]} for r in rows]
    return jsonify(messages)

@app.route('/send', methods=['POST'])
def send_message():
    data = request.get_json()
    name = data.get('name')
    message = data.get('message')

    if not name or not message:
        return jsonify({"error": "Missing name or message"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO messages (name, message, timestamp) VALUES (%s, %s, %s);",
                (name, message, datetime.now()))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
