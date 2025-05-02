from config import config as config
from config.logger_config import logger
from bson import ObjectId

class PointsRepository:
    def __init__(self, db):
        self.db = db
        self.collection = db[config.MONGODB_POINTS_COLLECTION]

    def get_points(self, username: str):
        logger.info(f"Fetching points for user: {username}")
        points = self.collection.find({"username": username}).to_list(length=None)
        return points

    def add_point(self, username: str, text: str, coords: dict, label: str, score: float, timestamp: str):
        logger.info(f"Adding point for user: {username}")
        point = {
            "username": username,
            "text": text,
            "coords": coords,
            "label": label,
            "score": score,
            "timestamp": timestamp
        }
        self.collection.insert_one(point)

    def get_all_points(self):
        logger.info("Fetching all points")
        points = self.collection.find()
        return [{**point, "_id": str(point["_id"])} for point in points]

    def remove_point(self, point_id: ObjectId):
        logger.info(f"Removing point with ID: {point_id}")
        result = self.collection.delete_one({"_id": point_id})
        return result.deleted_count > 0