from config.logger_config import logger

# nb:nc:emotion -> number hashset for each emotion
# nb:total -> total number of messages
# nb:class:emotion -> number of messages for each class (emotion)

class RedisNaiveBayesStorage:
    def __init__(self, redis_client):
        logger.info("Initializing RedisNaiveBayesStorage")
        self.redis_client = redis_client

    def increment_number(self, key: str, value: int) -> None:
        logger.info(f"Incrementing number for key: {key}, value: {value}")
        self.redis_client.incrby(key, value)

    def increment_hashset(self, key: str, field: str, value: int) -> None:
        logger.info(f"Incrementing value for key: {key}, field: {field}, value: {value}")
        self.redis_client.hincrby(key, field, value)
    
    def get_field(self, key: str, field: str) -> int:
        logger.info(f"Getting value for key: {key}, field: {field}")
        result = self.redis_client.hget(key, field)
        return int(result) if result is not None else 0

    def get_value(self, key: str) -> int:
        logger.info(f"Getting integer value for key: {key}")
        result = self.redis_client.get(key)
        return int(result) if result is not None else 0
