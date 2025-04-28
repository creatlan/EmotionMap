from config import config as config

class PointsRepository:
    def __init__(self, db):
        self.db = db
        self.collection = db[config.MONGODB_POINTS_COLLECTION]

    async def get_points(self, username: str):
        points = await self.collection.find({"username": username}).to_list(length=None)
        return points

    async def add_point(self, username: str, text: str, coords: dict, label: str, score: float, timestamp: str):
        point = {
            "username": username,
            "text": text,
            "coords": coords,
            "label": label,
            "score": score,
            "timestamp": timestamp
        }
        await self.collection.insert_one(point)

    async def get_all_points(self):
        points = await self.collection.find().to_list(length=None)
        return points
