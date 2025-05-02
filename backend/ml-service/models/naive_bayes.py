from config.logger_config import logger
from models.preprocessor import TextPreprocessor
from config import config as config
import requests
import math

class NaiveBayesModel:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.labels = config.EMOTION_LABELS
    
    def train(self, text, label):
        """
        Train the Naive Bayes model with the given text and label.
        """
        logger.info(f"Training Naive Bayes model with text: {text} and label: {label}")
        prepared_text = self.preprocessor.preprocess_text(text)

        for word in prepared_text:
            redis_get_url = f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{config.NB_WC_PREFIX}:{label}/{word}"
            word_count = requests.get(redis_get_url).json().get("value", 0)

            if word_count == 0:
                redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{config.NB_WC_PREFIX}:{label}:total/{config.INCREMENT_NUMBER}"
                requests.put(redis_put_url)

            redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{f"{config.NB_WC_PREFIX}:{label}"}/{word}/{config.INCREMENT_NUMBER}"
            requests.put(redis_put_url)

        redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{f"{config.NB_WC_PREFIX}:{label}:total"}/{config.INCREMENT_NUMBER}"
        requests.put(redis_put_url)

        logger.info(f"Trained Naive Bayes model with text: {text} and label: {label}")
    
    def predict(self, text):
        """
        Predict the label for the given text using the trained Naive Bayes model.
        """
        logger.info(f"Predicting label for text: {text}")
        labels_size = len(self.labels)
        prepared_text = self.preprocessor.preprocess_text(text)
        label_scores = [0] * labels_size
        for word in prepared_text:
            for i, label in enumerate(self.labels):
                redis_get_url = f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{f"{config.NB_WC_PREFIX}:{label}"}/{word}"
                word_count = requests.get(redis_get_url).json().get("value", 0) + 1
                total_count = requests.get(f"{config.REDIS_SERVICE_ENDPOINTS["VALUES"]}/{f"{config.NB_WC_PREFIX}:{label}:total"}").json().get("value", 0)
                if total_count > 0:
                    label_scores[i] += math.log(word_count / total_count)

        total_sum = sum([math.exp(score) for score in label_scores])

        label_scores = [math.exp(score) / total_sum for score in label_scores]
        max_score = max(label_scores)
        max_index = label_scores.index(max_score)
        predicted_label = self.labels[max_index]
        logger.info(f"Predicted label: {predicted_label} with score: {max_score}")

        return predicted_label, max_score
    