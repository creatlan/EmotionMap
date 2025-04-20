from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model.emotion_analyzer import analyze_emotion
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

POINTS_FILE = "data/points.json"

# Обеспечим наличие файла
if not os.path.exists(POINTS_FILE):
    with open(POINTS_FILE, "w") as f:
        json.dump([], f)

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "description": "EmotionMap API",
        "endpoints": {
            "/analyze": {
                "method": "POST",
                "description": "Анализирует текст на эмоции",
                "request_format": {
                    "text": "строка текста",
                    "coords": {"lat": 55.75, "lng": 37.61}
                },
                "response_format": {
                    "label": "эмоция",
                    "score": "уверенность (0-1)"
                }
            },
            "/points": {
                "method": "GET",
                "description": "Возвращает все сохранённые точки"
            }
        }
    })

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")
    coords = data.get("coords", {})

    label, score = analyze_emotion(text)

    new_point = {
        "text": text,
        "coords": coords,
        "label": label,
        "score": score,
        "timestamp": datetime.utcnow().isoformat()
    }

    with open(POINTS_FILE, "r+") as f:
        points = json.load(f)
        points.append(new_point)
        f.seek(0)
        json.dump(points, f, indent=2)

    return jsonify({"label": label, "score": score})


@app.route("/points", methods=["GET"])
def get_points():
    with open(POINTS_FILE, "r") as f:
        points = json.load(f)
    return jsonify(points)


if __name__ == "__main__":
    app.run(debug=True)
