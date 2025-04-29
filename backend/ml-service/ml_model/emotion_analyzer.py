# from transformers import pipeline

# classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

# def analyze_emotion(text):
#     results = classifier(text)[0]
#     top = sorted(results, key=lambda x: x['score'], reverse=True)[0]
#     return top["label"], round(top["score"], 2)

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from config.logger_config import logger

# Используем модель DistilBERT (GoEmotions)
model_name = "bhadresh-savani/distilbert-base-uncased-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

classifier = pipeline("text-classification", model=model, tokenizer=tokenizer, top_k=1)

def analyze_emotion(text):
    logger.info(f"Analyzing emotion for text: {text}")
    result = classifier(text)[0][0]
    label = result["label"].lower()
    score = float(result["score"])
    logger.info(f"Emotion detected: {label} with score: {score}")
    return label, score

