import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATHS = {
    "Enron": os.path.join(BASE_DIR, "data", "Enron.csv")
}


def load_and_combine(paths):
    combined_data = []

    for name, path in paths.items():
        if not os.path.exists(path):
            print(f"⚠️ File not found: {path}")
            continue

        df = pd.read_csv(path)
        print(f"✅ Loaded {name}: {df.shape}, Columns: {list(df.columns)}")

        # Detect text column
        text_col = None
        for candidate in ["text_combined", "text", "body", "content", "Message"]:
            if candidate in df.columns:
                text_col = candidate
                break

        if text_col is None:
            print(f"⚠️ No text column found in {name}, skipping")
            continue

        # Keep only text + label
        df_subset = df[[text_col]].copy()
        if "label" in df.columns:
            df_subset["label"] = df["label"]
        else:
            df_subset["label"] = 1  # Assume all phishing if unlabeled

        df_subset.rename(columns={text_col: "text"}, inplace=True)
        df_subset["source"] = name
        combined_data.append(df_subset)

    if not combined_data:
        raise ValueError("❌ No valid datasets loaded!")

    combined_df = pd.concat(combined_data, ignore_index=True)

    # Drop missing/empty text
    combined_df = combined_df.dropna(subset=["text"])
    combined_df["text"] = combined_df["text"].astype(str).str.lower().str.strip()
    combined_df = combined_df[combined_df["text"].str.len() > 0]

    print(f"📊 Combined dataset size: {combined_df.shape}")
    print(combined_df["label"].value_counts())
    return combined_df


def train_model():
    df = load_and_combine(DATA_PATHS)

    X = df["text"]
    y = df["label"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    vectorizer = TfidfVectorizer(
    sublinear_tf=True,  # smooths term frequencies
    stop_words="english",
    max_features=5000   # optional: limits feature space for faster training
)

    X_train_features = vectorizer.fit_transform(X_train)
    X_test_features = vectorizer.transform(X_test)

    model = MultinomialNB()
    model.fit(X_train_features, y_train)

    y_pred = model.predict(X_test_features)

    print("✅ Train Accuracy:", accuracy_score(y_train, model.predict(X_train_features)))
    print("✅ Test Accuracy:", accuracy_score(y_test, y_pred))

    # Save model + vectorizer
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/phishing_model.pkl")
    joblib.dump(vectorizer, "models/vectorizer.pkl")
    print("💾 Model and vectorizer saved in /models/")


if __name__ == "__main__":
    train_model()
