import logging 
logger = logging.getLogger("ml_service")
logger.setLevel(logging.DEBUG) 
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)