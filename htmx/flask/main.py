from typing import Any, Dict, Tuple
from flask import Flask, render_template, request
import psycopg2
from datetime import datetime

from werkzeug.datastructures import ImmutableMultiDict

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

def fetch_places():
    cursor = db.cursor()
    cursor.execute("SELECT Nooks.Id, Name, Open, Close, Shade, Outlets FROM Nooks JOIN Ammenities ON Nooks.ID = Ammenities.ID")
    return [row_to_place(row) for row in cursor.fetchall()]

def add_place(form: ImmutableMultiDict[str, str]):
    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO Nooks(Name, Open, Close, Address) VALUES (%s, %s, %s, %s) RETURNING Id, Name, Open, Close", (form.get("name"), form.get("open"), form.get("close"), form.get("address")))
        id, name, open, close = cursor.fetchone() # pyright: ignore
        print(form.to_dict())
        cursor.execute("INSERT INTO Ammenities(Id, Shade, Outlets) VALUES (%s, %s, %s) RETURNING Shade, Outlets", (id, form.get("shade", "false"), form.get("outlets", "false")))
        shade, outlets = cursor.fetchone() # pyright: ignore
        db.commit()
    except Exception as e:
        db.rollback()
        print(e)
        return

    return {
        "id": id,
        "name": name,
        "open": open,
        "close": close,
        "shade": shade,
        "outlets": outlets,
    }

def get_place_details(place_id: int) -> tuple[Any, ...]:
    cursor = db.cursor()
    cursor.execute("SELECT Name, Address FROM Nooks WHERE Id = %s", (place_id,))
    return cursor.fetchone() # pyright: ignore

@app.route("/")
def root():
    places = fetch_places()
    return render_template("index.html", places=places)

@app.post("/create")
def create_ui():
    return render_template("add_modal.html")

@app.put("/create")
def create_place():
    place = add_place(request.form)
    return render_template("card.html", place=place)

@app.post("/view")
def view():
    id = int(request.query_string)
    title, address = get_place_details(id)
    return render_template("place_modal.html", title=title, address=address)
