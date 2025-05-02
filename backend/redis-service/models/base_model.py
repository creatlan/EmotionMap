from config.logger_config import logger

# nb:nc:emotion -> number hashset for each emotion
# nb:total -> total number of messages
# nb:class:emotion -> number of messages for each class (emotion)

class RedisNaiveBayesStorage:
    def __init__(self, redis_client):
        logger.info("Initializing RedisNaiveBayesStorage")
        self.redis_client = redis_client

    def increment_number(self, key: str, value: str) -> None:
        logger.info(f"Incrementing number for key: {key}, value: {value}")
        self.redis_client.hincrby(key, value, 1)

    def increment_hashset(self, key: str, field: str, value: str) -> None:
        logger.info(f"Incrementing value for key: {key}, field: {field}, value: {value}")
        self.redis_client.hincrby(key, field, value)
    
    def get(self, key: str, field: str) -> int:
        logger.info(f"Getting value for key: {key}, field: {field}")
        result = self.redis_client.hget(key, field)
        return int(result) if result is not None else 0
