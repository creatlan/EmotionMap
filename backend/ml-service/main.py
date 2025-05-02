import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.clusterizer import cluster_points
import json
import os
from datetime import datetime
import numpy as np
from config.logger_config import logger
from config import config as config
import requests
from contextlib import asynccontextmanager
from models.naive_bayes import NaiveBayesModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up...")
    app.state.naive_bayes_model = NaiveBayesModel()
    try:
        yield
    finally:
        logger.info("Shutting down...")

app = FastAPI(lifespan=lifespan)

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

class TrainRequest(BaseModel):
    text: str
    label: str

@app.post("/points", response_model=AnalyzeResponse)
async def point(request: AnalyzeRequest):
    # Get emotion probabilities based on existing data
    emotion_counts = {}
    total_emotions = 0
    
    for label in app.state.naive_bayes_model.labels:
        try:
            count_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}:count"
            emotion_count = requests.get(count_url).json().get("value", 0)
            emotion_counts[label] = emotion_count
            total_emotions += emotion_count
        except Exception as e:
            logger.error(f"Error fetching emotion count for {label}: {e}")
            emotion_counts[label] = 0
    
    # Add a small value for smoothing if no data exists
    if total_emotions == 0:
        for label in app.state.naive_bayes_model.labels:
            emotion_counts[label] = 1
        total_emotions = len(app.state.naive_bayes_model.labels)
    
    # Get prediction with emotion probabilities
    label, score = app.state.naive_bayes_model.predict(
        request.text, 
        {label: count/total_emotions for label, count in emotion_counts.items()}
    )

    new_point = {
        "username": request.username,
        "text": request.text,
        "coords": request.coords,
        "label": label,
        "score": score,
        "timestamp": datetime.utcnow().isoformat()
    }

    response = requests.post(
        f"http://{config.MONGODB_SERVICE_HOST}:{config.MONGODB_SERVICE_PORT}/points",
        json=new_point
    )
    if response.status_code != 200:
        logger.error(f"Failed to add point to MongoDB: {response.text}")
        raise HTTPException(status_code=500, detail="Failed to add point to MongoDB")

    return {"label": label, "score": score}

@app.post("/models/train")
async def train(request: TrainRequest):
    logger.info(f"Training Naive Bayes model with text: {request.text} and label: {request.label}")
    app.state.naive_bayes_model.train(request.text, request.label)
    return {"message": "Model trained successfully"}

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

