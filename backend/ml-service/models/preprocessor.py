import re
from config.logger_config import logger

class TextPreprocessor:
    def __init__(self):
        pass

    def delete_special_symbols(self, text):
        logger.info(f"Clearing text: {text}")
        text = re.sub(r'[0-9:;,!@#$%^&*()\[\]"\'+=_.`~/?.>,<\\|{}]', '', text)
        return text.lower()

    def divide_text_by_words(self, text):
        logger.info(f"Dividing text into words: {text}")
        words = text.split()
        return words
    
    def preprocess_text(self, text):
        logger.info(f"Preprocessing text: {text}")
        text = self.delete_special_symbols(text)
        words = self.divide_text_by_words(text)
        return words