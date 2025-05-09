from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from bson import ObjectId
from config.logger_config import logger

router = APIRouter()

def get_emotions_repository(request: Request):
    return request.app.state.emotions_repository

@router.get("/emotions/")
def get_points(emotions_repository = Depends(get_emotions_repository)):
    logger.info("Fetching all emotions")
    try:
        emotions = emotions_repository.get_emotions()
        result = {"value": [{"emotion": emotion, "color": color} for emotion, color in emotions]}
        return result
    except Exception as e:
        logger.error(f"Error fetching all emotions: {e}")
        raise HTTPException(status_code=500, detail="Error fetching all emotions")