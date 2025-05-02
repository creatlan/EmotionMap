import os

MONGODB_SERVICE_HOST = os.getenv("MONGODB_SERVICE_HOST", "mongodb-service")
MONGODB_SERVICE_PORT = int(os.getenv("MONGODB_SERVICE_PORT", 8001))
MONGODB_SERVICE_ENDPOINTS = {
    "POINTS": "/points",
    "USERS": "/users",
    "CLUSTERS": "/clusters"
}

REDIS_SERVICE_HOST = os.getenv("REDIS_SERVICE_HOST", "redis-service")
REDIS_SERVICE_PORT = int(os.getenv("REDIS_SERVICE_PORT", 8002))
REDIS_SERVICE_ENDPOINTS = {
    "VALUES": "/values",
    "NUMBERS": "/numbers"
}
