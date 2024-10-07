from typing import Any, Dict, Tuple
from flask import Flask, render_template
import psycopg2
from datetime import datetime

db = psycopg2.connect(
    database="nooks",
    user="test",
    password="password",
)

app = Flask(__name__)

def row_to_place(row: Tuple[Any, ...]) -> Dict:
    return {
        "id": row[0],
        "name": row[1],
        "open": row[2].strftime("%I:%M %p"),
        "close": row[3].strftime("%I:%M %p"),
        "shade": row[4],
        "outlets": row[5],
        "open_now": row[2] <= datetime.now().time() <= row[3],
    }

@app.route("/")
def root():
    cursor = db.cursor()
    cursor.execute("SELECT Nooks.Id, Name, Open, Close, Shade, Outlets FROM Nooks JOIN Ammenities ON Nooks.ID = Ammenities.ID")
    places = [row_to_place(row) for row in cursor.fetchall()]

    return render_template("index.html", places=places)

@app.post("/create")
def create():
    return render_template("add_modal.html")
