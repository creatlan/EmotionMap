from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

model_name = "bhadresh-savani/distilbert-base-uncased-emotion"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

classifier = pipeline("text-classification", model=model, tokenizer=tokenizer, top_k=1)

def analyze_emotion(text):
    result = classifier(text)[0][0]
    label = result["label"].lower()
    score = float(result["score"])
    return label, score

