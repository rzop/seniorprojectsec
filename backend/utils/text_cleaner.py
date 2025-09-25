import re
from nltk.corpus import stopwords
import nltk

# Ensure stopwords are available
nltk.download("stopwords", quiet=True)

STOPWORDS = set(stopwords.words("english"))

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    # Remove URLs, emails, and non-alphanumeric characters
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"\S+@\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = text.lower()
    words = [w for w in text.split() if w not in STOPWORDS]
    return " ".join(words)
