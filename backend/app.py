from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

# New imports for OPENAI assistant
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # load .env variables

app = Flask(__name__)
CORS(app)  # allow frontend (React) to connect

# Initialize GROQ client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#Prompt for the AI assistant
SYSTEM_PROMPT = """
You are the SecuraSphere AI helper, a friendly cybersecurity tutor.
Your name is Aegis, which comes from the name of the shield used by Zeus and Athena in Greek mythology.
You explain things clearly and simply, focusing on:
- password strength and safe password practices
- phishing detection and safe email behavior
- social media privacy and online safety
- general cybersecurity best practices

Be encouraging, helpful, and non-judgmental. Avoid asking for real passwords or sensitive info;
if needed, ask users to use made-up examples instead.
"""

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
@app.route("/assistant", methods=["POST"])
def assistant():
    """
    Simple AI helper endpoint for SecuraSphere using Groq.
    """
    data = request.get_json(force=True)

    user_messages = data.get("messages", [])
    if not isinstance(user_messages, list):
        return jsonify({"error": "messages must be a list"}), 400

    # Prepend system prompt
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + user_messages

    try:
        # Groq uses an OpenAI-compatible API for chat completions
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",  # good, fast, free-ish model
            messages=messages,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Groq error: {str(e)}"}), 500

    reply = response.choices[0].message

    return jsonify({
        "message": {
            "role": reply.role,
            "content": reply.content
        }
    })


if __name__ == "__main__":
    app.run(debug=False)
