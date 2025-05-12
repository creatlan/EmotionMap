import json
import requests

MONGODB_POINTS_URL = "http://localhost:8001/points"
ML_TRAIN_URL = "http://localhost:8000/models/train"

with open('emotions_data.txt', 'r', encoding='utf-8') as file:
    emotions_data = json.load(file)

filtered_emotions_data = []
emotion_counts = {}

for point in emotions_data:
    label = point["label"]
    if emotion_counts.get(label, 0) < 7:
        filtered_emotions_data.append(point)
        emotion_counts[label] = emotion_counts.get(label, 0) + 1

for point in filtered_emotions_data:
    response = requests.post(MONGODB_POINTS_URL, json=point)
    if response.status_code == 200:
        print(f"Inserted point: {point['text']} with label: {point['label']} into MongoDB.")
    else:
        print(f"Failed to insert point: {point['text']} with label: {point['label']}. Status code: {response.status_code}, Response: {response.text}")

for point in emotions_data:
    train_data = {
        "text": point["text"],
        "label": point["label"]
    }
    response = requests.post(ML_TRAIN_URL, json=train_data)
    if response.status_code == 200:
        print(f"Trained model with text: {point['text']} and label: {point['label']}.")
    else:
        print(f"Failed to train model with text: {point['text']}. Status code: {response.status_code}, Response: {response.text}")