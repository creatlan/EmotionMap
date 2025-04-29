from config import logger_config
logger = logger_config.logger
from config import config as config

class AuthenticationRepository:
    def __init__(self, db):
        self.db = db
        self.collection = db[config.MONGODB_USERS_COLLECTION]

    def create_user(self, username, password):
        if self.db.users.find_one({"username": username}):
            logger.warning(f"User {username} already exists.")
            return None
        result = self.db.users.insert_one({"username": username, "password": password})
        return result.inserted_id

    def get_user(self, username):
        logger.info(f"Fetching user: {username}")
        user = self.db.users.find_one({"username": username})
        return user
    
    def remove_user(self, username):
        logger.info(f"Removing user: {username}")
        result = self.db.users.delete_one({"username": username})