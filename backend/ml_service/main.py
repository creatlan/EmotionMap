import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_model.emotion_analyzer import analyze_emotion
from ml_model.clusterizer import cluster_points
import json
import os
from datetime import datetime
import numpy as np
from config.logger_config import logger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POINTS_FILE = "data/points.json"
CLUSTER_FILE = "data/clusters.json"

if not os.path.exists(POINTS_FILE):
    with open(POINTS_FILE, "w") as f:
        json.dump([], f)

class AnalyzeRequest(BaseModel):
    text: str
    coords: dict

class AnalyzeResponse(BaseModel):
    label: str
    score: float

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    label, score = analyze_emotion(request.text)

    new_point = {
        "text": request.text,
        "coords": request.coords,
        "label": label,
        "score": score,
        "timestamp": datetime.utcnow().isoformat()
    }

    with open(POINTS_FILE, "r+") as f:
        points = json.load(f)
        points.append(new_point)
        f.seek(0)
        json.dump(points, f, indent=2)

    return {"label": label, "score": score}

@app.get("/points")
async def get_points():
    with open(POINTS_FILE, "r") as f:
        points = json.load(f)
    return points

@app.get("/clusters")
async def get_clusters(n: int = 5):
    logger.info(f"/clusters endpoint called with n={n}")
    clusters = []
    with open(POINTS_FILE, "r") as f:
        points = json.load(f)
    clusters = cluster_points(points, n)

    def convert_numpy(obj):
        if isinstance(obj, (np.integer, np.floating)):
            return obj.item()
        return obj

    clusters = json.loads(json.dumps(clusters, default=convert_numpy))
    logger.info(f"/clusters endpoint returning {len(clusters)} clusters")
    return clusters

