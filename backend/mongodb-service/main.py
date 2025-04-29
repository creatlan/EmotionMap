from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from contextlib import asynccontextmanager
from config import config as config
from config import logger_config
logger = logger_config.logger
from repositories.points_repository import PointsRepository
from repositories.auth_repository import AuthenticationRepository
from pydantic import BaseModel
from bson import ObjectId

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MongoDB connection...")
    try:
        app.state.client = MongoClient(f"{config.MONGODB_HOST}:{config.MONGODB_PORT}")
        app.state.db = app.state.client[config.MONGODB_DB]
        collections = [config.MONGODB_POINTS_COLLECTION, config.MONGODB_USERS_COLLECTION]
        for collection_name in collections:
            if collection_name not in app.state.db.list_collection_names():
                app.state.db.create_collection(collection_name)
                logger.info(f"Collection '{collection_name}' created.")
            else:
                logger.info(f"Collection '{collection_name}' already exists.")
        app.state.points_repository = PointsRepository(app.state.db)
        app.state.auth_repository = AuthenticationRepository(app.state.db)
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
def get_points(username: str):
    logger.info(f"Fetching points for user: {username}")
    try:
        points = app.state.points_repository.get_points(username)
        return points
    except Exception as e:
        logger.error(f"Error fetching points: {e}")
        raise HTTPException(status_code=500, detail="Error fetching points")

@app.get("/points")
def get_all_points():
    logger.info("Fetching all points")
    try:
        points = list(app.state.points_repository.get_all_points())
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
def add_point(point: Point):
    logger.info(f"Adding point for user: {point.username}")
    try:
        app.state.points_repository.add_point(
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
    return {"status": "ok"}

@app.delete("/point/{_id}")
def delete_point(_id: str):
    logger.info(f"Deleting point with ID: {_id}")
    try:
        result = app.state.points_repository.remove_point(ObjectId(_id))
        if not result:
            logger.error("Point not found")
            raise HTTPException(status_code=404, detail="Point not found")
    except Exception as e:
        logger.error(f"Error deleting point: {e}")
        raise HTTPException(status_code=500, detail="Error deleting point")
    return {"status": "ok"}

@app.get("/user/{username}")
def get_user(username: str, password: str = None):
    logger.info(f"Fetching user: {username}")
    try:
        user = app.state.auth_repository.get_user(username)
        if not user:
            logger.error("User not found")
            raise HTTPException(status_code=404, detail="User not found")
        if password and user["password"] != password:
            logger.error("Invalid password")
            raise HTTPException(status_code=401, detail="Invalid password")
        else:
            logger.info("User found")
        # Convert ObjectId to string for JSON serialization
        user["_id"] = str(user["_id"])
        return user
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user")

@app.post("/user/{username}")
def create_user(username: str, password: str):
    logger.info(f"Creating user: {username}")
    try:
        user_id = app.state.auth_repository.create_user(username, password)
        if not user_id:
            logger.error("User already exists")
            raise HTTPException(status_code=400, detail="User already exists")
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Error creating user")
    return {"status": "ok", "user_id": str(user_id)}

@app.delete("/user/{username}")
def delete_user(username: str):
    logger.info(f"Deleting user: {username}")
    try:
        result = app.state.auth_repository.remove_user(username)
        if not result:
            logger.error("User not found")
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail="Error deleting user")
    return {"status": "ok"}
