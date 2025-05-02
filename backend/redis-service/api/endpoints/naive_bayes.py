from fastapi import FastAPI
from fastapi import APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()
