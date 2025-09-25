from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)  # allow frontend (React) to connect

# Load model + vectorizer
MODEL_PATH = "models/phishing_model.pkl"
VECTORIZER_PATH = "models/vectorizer.pkl"

if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
    raise FileNotFoundError("❌ Model or vectorizer not found. Please run train_model.py first.")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

@app.route("/")
def home():
    return jsonify({"message": "Phishing Detection Backend is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        email_text = data.get("email", "")

        if not email_text.strip():
            return jsonify({"error": "No email text provided"}), 400

        # Transform input with the trained vectorizer
        features = vectorizer.transform([email_text])
        prediction = model.predict(features)[0]

        label = "phishing" if prediction == 1 else "legit"

        return jsonify({
            "email": email_text,
            "prediction": int(prediction),
            "label": label
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False)
