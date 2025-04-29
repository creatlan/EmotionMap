from config import config as config

class PointsRepository:
    def __init__(self, db):
        self.db = db
        self.collection = db[config.MONGODB_POINTS_COLLECTION]

    def get_points(self, username: str):
        points = self.collection.find({"username": username}).to_list(length=None)
        return points

    def add_point(self, username: str, text: str, coords: dict, label: str, score: float, timestamp: str):
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
        points = self.collection.find()
        return [{**point, "_id": str(point["_id"])} for point in points]
