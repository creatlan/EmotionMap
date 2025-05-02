from config.logger_config import logger

# nb:nc:emotion -> number
class RedisNaiveBayesStorage:
    def __init__(self, redis_client):
        logger.info("Initializing RedisNaiveBayesStorage")
        self.redis_client = redis_client

    def increment(self, key: str, value: str) -> None:
        logger.info(f"Incrementing value for key: {key}, value: {value}")
        self.redis_client.hincrby(key, value, 1)

    def get(self, key: str) -> dict:
        logger.info(f"Getting value for key: {key}")
        return self.redis_client.hgetall(key)
    