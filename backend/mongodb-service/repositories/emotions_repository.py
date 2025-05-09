from config import config as config
from config.logger_config import logger
from bson import ObjectId
import requests

class EmotionsRepository:
    def __init__(self, db):
        self.db = db
        self.collection = db[config.MONGODB_EMOTIONS_COLLECTION]
        for emotion, color in config.PRIMARY_EMOTION_LABELS:
            self.add_emotion(emotion, color)
        logger.info(f"Emotions collection initialized with default emotions: {config.PRIMARY_EMOTION_LABELS}")
        
    def get_emotions(self):
        logger.info(f"Fetching emotion list") 
        emotions = self.collection.find({}).to_list(length=None) # emotion | color
        return [(emotion["emotion"], emotion["color"]) for emotion in emotions]

    def add_emotion(self, emotion: str, color: str):
        logger.info(f"Adding emotion: {emotion} with color: {color}")
        if self.collection.find_one({"emotion": emotion}):
            logger.warning(f"Emotion {emotion} already exists.")
            return False
        emotion_data = {
            "emotion": emotion,
            "color": color
        }
        self.collection.insert_one(emotion_data)
        logger.info(f"Emotion {emotion} added successfully")
        return True
    
    def remove_emotion(self, emotion: str):
        logger.info(f"Removing emotion: {emotion}")
        result = self.collection.delete_one({"emotion": emotion})
        return result.deleted_count > 0
        