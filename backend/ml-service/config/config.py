import os

MONGODB_SERVICE_HOST = os.getenv("MONGODB_SERVICE_HOST", "mongodb-service")
MONGODB_SERVICE_PORT = int(os.getenv("MONGODB_SERVICE_PORT", 8001))
MONGODB_SERVICE_ENDPOINTS = {
    "POINTS": f"http://{MONGODB_SERVICE_HOST}:{MONGODB_SERVICE_PORT}/points",
    "USERS": f"http://{MONGODB_SERVICE_HOST}:{MONGODB_SERVICE_PORT}/users",
    "CLUSTERS": f"http://{MONGODB_SERVICE_HOST}:{MONGODB_SERVICE_PORT}/clusters",
}

REDIS_SERVICE_HOST = os.getenv("REDIS_SERVICE_HOST", "redis-service")
REDIS_SERVICE_PORT = int(os.getenv("REDIS_SERVICE_PORT", 8002))
REDIS_SERVICE_ENDPOINTS = {
    "VALUES": f"http://{REDIS_SERVICE_HOST}:{REDIS_SERVICE_PORT}/values"
}

INCREMENT_NUMBER = 1
EMOTIONS_NUMBER = 11

EMOTION_LABELS = ['empty', 'sadness', 'enthusiasm', 'neutral', 
                       'worry', 'surprise', 'love', 'fun', 'hate',
                         'happiness', 'boredom', 'relief', 'anger']

NB_WC_PREFIX = "nb:wc"
