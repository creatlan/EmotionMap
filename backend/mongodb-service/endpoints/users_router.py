from fastapi import APIRouter, HTTPException, Depends, Request
from config.logger_config import logger

router = APIRouter()

def get_auth_repository(request: Request):
    return request.app.state.auth_repository

@router.get("/users/{username}")
def get_user(username: str, password: str = None, auth_repository = Depends(get_auth_repository)):
    logger.info(f"Fetching user: {username}")
    try:
        user = auth_repository.get_user(username)
        if not user:
            logger.error("User not found")
            raise HTTPException(status_code=404, detail="User not found")
        if password and user["password"] != password:
            logger.error("Invalid password")
            raise HTTPException(status_code=401, detail="Invalid password")
        else:
            logger.info("User found")
        return user
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user")

@router.post("/users/{username}")
def create_user(username: str, password: str, auth_repository = Depends(get_auth_repository)):
    logger.info(f"Creating user: {username}")
    try:
        user_id = auth_repository.create_user(username, password)
        if not user_id:
            logger.error("User already exists")
            raise HTTPException(status_code=400, detail="User already exists")
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Error creating user")
    return {"status": "ok", "user_id": str(user_id)}

@router.delete("/users/{username}")
def delete_user(username: str, auth_repository = Depends(get_auth_repository)):
    logger.info(f"Deleting user: {username}")
    try:
        result = auth_repository.remove_user(username)
        if not result:
            logger.error("User not found")
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail="Error deleting user")
    return {"status": "ok"}
