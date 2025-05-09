from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from contextlib import asynccontextmanager
from config import config as config
from config.logger_config import logger
from repositories.points_repository import PointsRepository
from repositories.auth_repository import AuthenticationRepository
from repositories.emotions_repository import EmotionsRepository
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from endpoints.points_router import router as points_router
from endpoints.users_router import router as users_router
from endpoints.emotions_router import router as emotions_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MongoDB connection...")
    try:
        app.state.client = MongoClient(f"{config.MONGODB_HOST}:{config.MONGODB_PORT}")
        app.state.db = app.state.client[config.MONGODB_DB]
        collections = [config.MONGODB_POINTS_COLLECTION, config.MONGODB_USERS_COLLECTION, config.MONGODB_EMOTIONS_COLLECTION]
        for collection_name in collections:
            if collection_name not in app.state.db.list_collection_names():
                app.state.db.create_collection(collection_name)
                logger.info(f"Collection '{collection_name}' created.")
            else:
                logger.info(f"Collection '{collection_name}' already exists.")
        app.state.points_repository = PointsRepository(app.state.db)
        app.state.auth_repository = AuthenticationRepository(app.state.db)
        app.state.emotions_repository = EmotionsRepository(app.state.db)
        logger.info("MongoDB connection established.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise HTTPException(status_code=500, detail="MongoDB connection error")
    try:
        yield
    finally:
        app.state.client.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(points_router)
app.include_router(users_router)
app.include_router(emotions_router)