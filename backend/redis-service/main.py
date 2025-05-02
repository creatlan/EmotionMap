from fastapi import FastAPI
from contextlib import asynccontextmanager
from redis import Redis

@asynccontextmanager
async def lifespan():
    print("Starting up...")
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

