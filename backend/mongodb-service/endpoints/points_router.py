from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from bson import ObjectId
from config.logger_config import logger

router = APIRouter()

def get_points_repository(request: Request):
    return request.app.state.points_repository

@router.get("/points/{username}")
def get_points(username: str, points_repository = Depends(get_points_repository)):
    logger.info(f"Fetching points for user: {username}")
    try:
        points = points_repository.get_points(username)
        return points
    except Exception as e:
        logger.error(f"Error fetching points: {e}")
        raise HTTPException(status_code=500, detail="Error fetching points")

@router.get("/points")
def get_all_points(points_repository = Depends(get_points_repository)):
    logger.info("Fetching all points")
    try:
        points = list(points_repository.get_all_points())
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

@router.post("/points")
def add_point(point: Point, points_repository = Depends(get_points_repository)):
    logger.info(f"Adding point for user: {point.username}")
    try:
        points_repository.add_point(
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

@router.delete("/points/{_id}")
def delete_point(_id: str, points_repository = Depends(get_points_repository)):
    logger.info(f"Deleting point with ID: {_id}")
    try:
        result = points_repository.remove_point(ObjectId(_id))
        if not result:
            logger.error("Point not found")
            raise HTTPException(status_code=404, detail="Point not found")
    except Exception as e:
        logger.error(f"Error deleting point: {e}")
        raise HTTPException(status_code=500, detail="Error deleting point")
    return {"status": "ok"}

class UpdatePoint(BaseModel):
    id: str
    text: str
    coords: dict
    label: str
    score: float
    timestamp: str

@router.put("/points/")
def update_point(point: UpdatePoint, points_repository = Depends(get_points_repository)):
    logger.info(f"Updating point")
    try:
        result = points_repository.update_point(
            point_id=ObjectId(point.id),
            text=point.text,
            coords=point.coords,
            label=point.label,
            score=point.score,
            timestamp=point.timestamp
        )
        
        if not result:
            logger.error("Point not found or not modified")
            raise HTTPException(status_code=404, detail="Point not found or not modified")
            
    except ValueError:
        logger.error("Invalid ObjectId format")
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    except Exception as e:
        logger.error(f"Error updating point: {e}")
        raise HTTPException(status_code=500, detail="Error updating point")
        
    return {"status": "ok"}