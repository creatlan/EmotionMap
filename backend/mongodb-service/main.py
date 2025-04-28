from fastapi import FastAPI, HTTPException
from config.logger_config import logger
from pymongo import MongoClient
from contextlib import asynccontextmanager
from config import config as config
from repositories.points_repository import PointsRepository
from pydantic import BaseModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MongoDB connection...")
    try:
        app.state.client = MongoClient(f"{config.MONGODB_HOST}:{config.MONGODB_PORT}")
        app.state.db = app.state.client[config.MONGODB_DB]
        collections = [config.MONGODB_POINTS_COLLECTION]
        for collection_name in collections:
            if collection_name not in app.state.db.list_collection_names():
                app.state.db.create_collection(collection_name)
                logger.info(f"Collection '{collection_name}' created.")
            else:
                logger.info(f"Collection '{collection_name}' already exists.")
        app.state.points_repository = PointsRepository(app.state.db)
        logger.info("MongoDB connection established.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise HTTPException(status_code=500, detail="MongoDB connection error")
    try:
        yield
    finally:
        app.state.client.close()

app = FastAPI(lifespan=lifespan)

@app.get("/points/{username}")
async def get_points(username: str):
    logger.info(f"Fetching points for user: {username}")
    try:
        points = await app.state.points_repository.get_points(username)
        return points
    except Exception as e:
        logger.error(f"Error fetching points: {e}")
        raise HTTPException(status_code=500, detail="Error fetching points")

@app.get("/points")
async def get_all_points():
    logger.info("Fetching all points")
    try:
        points = await app.state.points_repository.get_all_points()
        return points
    except Exception as e:
        logger.error(f"Error fetching all points: {e}")
        raise HTTPException(status_code=500, detail="Error fetching all points")

class Point(BaseModel):
    username: str
    text: str
    coords: dict
    label: str
    score: float
    timestamp: str

@app.post("/point")
async def add_point(point: Point):
    logger.info(f"Adding point for user: {point.username}")
    try:
        await app.state.points_repository.add_point(
            username=point.username,
            text=point.text,
            coords=point.coords,
            label=point.label,
            score=point.score,
            timestamp=point.timestamp
        )
    except Exception as e:
        logger.error(f"Error adding point: {e}")
        raise HTTPException(status_code=500, detail="Error adding point")
    
