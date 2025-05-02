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

        if label not in self.labels:
            logger.error(f"Label '{label}' is not valid. Valid labels are: {self.labels}")
            raise ValueError(f"Label '{label}' is not valid. Valid labels are: {self.labels}")

        # Increment emotion counter for calculating prior probabilities
        try:
            redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}:count/{config.INCREMENT_NUMBER}"
            requests.put(redis_put_url)
        except Exception as e:
            logger.error(f"Error incrementing count for label {label}: {e}")

        for word in prepared_text:
            redis_get_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}/{word}"
            word_count = requests.get(redis_get_url).json().get("value", 0)

            if word_count == 0:
                redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}:total/{config.INCREMENT_NUMBER}"
                requests.put(redis_put_url)

            redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}/{word}/{config.INCREMENT_NUMBER}"
            requests.put(redis_put_url)

        redis_put_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}:total/{config.INCREMENT_NUMBER}"
        requests.put(redis_put_url)

        logger.info(f"Trained Naive Bayes model with text: {text} and label: {label}")
    
    def predict(self, text, prior_probabilities=None):
        """
        Predict the label for the given text using the trained Naive Bayes model.
        
        Args:
            text (str): The text to predict the emotion for
            prior_probabilities (dict, optional): Dictionary mapping label to its prior probability
                                                 If None, equal probabilities are assumed
        """
        logger.info(f"Predicting label for text: {text}")
        labels_size = len(self.labels)
        prepared_text = self.preprocessor.preprocess_text(text)
        
        # Initialize scores with log of prior probabilities
        label_scores = [0] * labels_size
        if prior_probabilities:
            for i, label in enumerate(self.labels):
                # Get prior probability or default to uniform if not provided
                prior_prob = prior_probabilities.get(label, 1.0 / labels_size)
                # Add log of prior probability to score (avoid log(0))
                if prior_prob > 0:
                    label_scores[i] = math.log(prior_prob)
                else:
                    label_scores[i] = math.log(1e-10)  # Small value to avoid log(0)
                logger.debug(f"Prior probability for {label}: {prior_prob}, log: {label_scores[i]}")
        
        # Calculate conditional probabilities for each word
        for word in prepared_text:
            for i, label in enumerate(self.labels):
                try:
                    redis_get_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}/{word}"
                    word_count = requests.get(redis_get_url).json().get("value", 0) + 1  # Laplace smoothing
                    
                    total_count_url = f"{config.REDIS_SERVICE_ENDPOINTS['VALUES']}/{config.NB_WC_PREFIX}:{label}:total"
                    total_count = requests.get(total_count_url).json().get("value", 0)
                    
                    # Prevent division by zero
                    if total_count == 0:
                        total_count = 1e-10
                    
                    # Add log probability for the word
                    word_prob = word_count / total_count
                    label_scores[i] += math.log(word_prob)
                except Exception as e:
                    logger.error(f"Error in prediction for word '{word}' and label '{label}': {e}")
        
        # Convert log probabilities back to probabilities and normalize
        label_scores_exp = [math.exp(score) for score in label_scores]
        total_sum = sum(label_scores_exp)
        
        if total_sum == 0:
            # Handle edge case where all scores are very negative and exp() resulted in zeros
            normalized_scores = [1.0 / labels_size] * labels_size
        else:
            normalized_scores = [score / total_sum for score in label_scores_exp]
        
        max_score = max(normalized_scores)
        max_index = normalized_scores.index(max_score)
        predicted_label = self.labels[max_index]
        
        logger.info(f"Predicted label: {predicted_label} with score: {max_score}")
        return predicted_label, max_score
