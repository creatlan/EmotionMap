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
from config import config as config
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    username: str
    text: str
    coords: dict

class AnalyzeResponse(BaseModel):
    label: str
    score: float

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    label, score = analyze_emotion(request.text)

    new_point = {
        "username": request.username,
        "text": request.text,
        "coords": request.coords,
        "label": label,
        "score": score,
        "timestamp": datetime.utcnow().isoformat()
    }

    response = requests.post(
        f"http://{config.MONGODB_SERVICE_HOST}:{config.MONGODB_SERVICE_PORT}/point",
        json=new_point
    )
    if response.status_code != 200:
        logger.error(f"Failed to add point to MongoDB: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to add point to MongoDB")

    return {"label": label, "score": score}

@app.get("/clusters")
async def get_clusters(n: int = 5):
    logger.info(f"/clusters endpoint called with n={n}")
    clusters = []

    points = requests.get(
        f"http://{config.MONGODB_SERVICE_HOST}:{config.MONGODB_SERVICE_PORT}/points"
    ).json()

    clusters = await cluster_points(points, n)

    def convert_numpy(obj):
        if isinstance(obj, (np.integer, np.floating)):
            return obj.item()
        return obj

    clusters = json.loads(json.dumps(clusters, default=convert_numpy, skipkeys=True))
    logger.info(f"/clusters endpoint returning {len(clusters)} clusters")
    return clusters

