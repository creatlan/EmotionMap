import logging 
logger = logging.getLogger("ml_service")
logger.setLevel(logging.DEBUG) 
handler = logging.StreamHandler()
formatter = logging.Formatter("%(levelname)s:\t%(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)