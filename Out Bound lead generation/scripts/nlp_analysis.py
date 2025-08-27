import pandas as pd
from transformers import pipeline
import os
from dotenv import load_dotenv

# Load environment variables (if needed later)
load_dotenv()

# Load the scraped Reddit data
df = pd.read_csv("./data/reddit_posts.csv")

# Use a zero-shot classification model (no training needed)
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",  # Free pre-trained model
    device=-1  # Use CPU (no GPU required)
)

# Define intent labels
intent_labels = [
    "buying a house", 
    "selling a house", 
    "renting a property", 
    "other"
]

# Classify each post
def classify_text(text):
    if not isinstance(text, str) or len(text.strip()) == 0:
        return "other"  # Skip empty text
    result = classifier(text, intent_labels, multi_label=False)
    return result['labels'][0]  # Top predicted label

# Analyze the first 20 posts (to avoid rate limits)
sample_df = df.head(20).copy()
sample_df["intent"] = sample_df["text"].apply(classify_text)


# Add this after classifying the "intent" column
def assign_priority(intent):
    if intent == "buying a house":
        return "high"
    elif intent == "selling a house":
        return "medium"
    elif intent == "renting a property":
        return "low"
    else:
        return "ignore"

sample_df["priority"] = sample_df["intent"].apply(assign_priority)
sample_df.to_csv("./data/reddit_posts_analyzed.csv", index=False)

# Save results
sample_df.to_csv("./data/reddit_posts_analyzed.csv", index=False)
print("NLP analysis complete. Results saved!")




