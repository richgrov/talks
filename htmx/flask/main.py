from typing import Any, Dict, Tuple
from flask import Flask, render_template, request
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
def create_ui():
    return render_template("add_modal.html")

@app.put("/create")
def create_place():
    form = request.form

    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO Nooks(Name, Open, Close, Address) VALUES (%s, %s, %s, %s) RETURNING Id, Name, Open, Close", (form.get("name"), form.get("open"), form.get("close"), form.get("address")))
        id, name, open, close = cursor.fetchone()
        print(form.to_dict())
        cursor.execute("INSERT INTO Ammenities(Id, Shade, Outlets) VALUES (%s, %s, %s) RETURNING Shade, Outlets", (id, form.get("shade", "false"), form.get("outlets", "false")))
        shade, outlets = cursor.fetchone()
        db.commit()
    except Exception as e:
        db.rollback()
        return "error"

    place = {
            "id": id,
            "name": name,
            "open": open,
            "close": close,
            "shade": shade,
            "outlets": outlets,
            }
    return render_template("card.html", place=place)

@app.post("/view")
def view():
    id = int(request.query_string)

    cursor = db.cursor()
    cursor.execute("SELECT Name, Address FROM Nooks WHERE Id = %s", (id,))
    place = cursor.fetchone()

    return render_template("place_modal.html", title=place[0], address=place[1])
