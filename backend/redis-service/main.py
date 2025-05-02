from fastapi import FastAPI
from contextlib import asynccontextmanager
from redis import Redis
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models.base_model import RedisNaiveBayesStorage
from config import config as config

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    app.state.redis = Redis(host=config.REDIS_HOST, port=config.REDIS_PORT, db=config.REDIS_DB)
    app.state.redis_nb = RedisNaiveBayesStorage(app.state.redis)
    app.add_exception_handler(Exception, lambda request, exc: JSONResponse(status_code=500, content={"message": "Internal Server Error"}))
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

@app.put("/numbers/{key}/{value}")
async def increment_number(key: str, value: int):
    try:
        app.state.redis_nb.increment_number(key, value)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    return {"message": "Number incremented successfully"}

@app.put("/hashsets/{key}/{field}/{value}")
async def increment_hashset(key: str, field: str, value: int):
    try:
        app.state.redis_nb.increment_hashset(key, field, value)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    return {"message": "Hashset incremented successfully"}

@app.get("/values/{key}/{field}")
async def get_field(key: str, field: str):
    try:
        value = app.state.redis_nb.get_field(key, field)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    return {"value": value}

@app.get("/values/{key}")
async def get_value(key: str):
    try:
        value = app.state.redis_nb.get_value(key)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
    return {"value": value}
