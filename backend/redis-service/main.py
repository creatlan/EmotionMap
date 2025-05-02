from fastapi import FastAPI
from contextlib import asynccontextmanager
from redis import Redis
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models.base_model import RedisNaiveBayesStorage
from config import config as config

@asynccontextmanager
async def lifespan():
    print("Starting up...")
    app.state.redis = Redis(host=config.REDIS_HOST, port=config.REDIS_PORT, db=config.REDIS_DB)
    app.state.redis_nb = RedisNaiveBayesStorage(app.state.redis)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_exception_handler(Exception, lambda request, exc: JSONResponse(status_code=500, content={"message": "Internal Server Error"}))

    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

@app.put("/increment_number/{key}/{value}")
async def increment_number(key: str, value: str):
    app.state.redis_nb.increment_number(key, value)
    return {"message": "Number incremented successfully"}

@app.put("/increment_hashset/{key}/{field}/{value}")
async def increment_hashset(key: str, field: str, value: str):
    app.state.redis_nb.increment_hashset(key, field, value)
    return {"message": "Hashset incremented successfully"}

@app.get("/get/{key}/{field}")
async def get_value(key: str, field: str):
    value = app.state.redis_nb.get(key, field)
    return {"value": value}