#!/usr/bin/env python3
"""
combines phishing detection + social media exposure analyzer
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv
import joblib

# adds parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.smea.instagram_service import InstagramService
from src.smea.facebook_service import FacebookService
from src.smea.pii_engine import PIIEngine
from src.smea.risk_model import RiskModel

# loads environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # allows frontend to connect

# ============================================================================
# LOAD PHISHING DETECTION MODEL
# ============================================================================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models/phishing_model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "models/vectorizer.pkl")

phishing_model = None
vectorizer = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        phishing_model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        print("[OK] Phishing detection model loaded successfully")
    else:
        print("[WARNING] Phishing model files not found. Phishing detection will be unavailable.")
        print(f"   Expected: {MODEL_PATH}")
except Exception as e:
    print(f"[WARNING] Error loading phishing model: {str(e)}")


# ============================================================================
# PHISHING DETECTION ENDPOINTS
# ============================================================================

@app.route("/phishing/predict", methods=["POST"])
def predict_phishing():
    if phishing_model is None or vectorizer is None:
        return jsonify({
            "error": "Phishing detection model not available. Please run train_model.py first."
        }), 503
    
    try:
        data = request.get_json()
        email_text = data.get("email", "")

        if not email_text.strip():
            return jsonify({"error": "No email text provided"}), 400

        # Transform input with the trained vectorizer
        features = vectorizer.transform([email_text])
        prediction = phishing_model.predict(features)[0]
        
        # Get prediction probability if available
        try:
            probabilities = phishing_model.predict_proba(features)[0]
            confidence = float(max(probabilities) * 100)
        except:
            confidence = None

        label = "phishing" if prediction == 1 else "legit"

        return jsonify({
            "success": True,
            "email": email_text[:200] + "..." if len(email_text) > 200 else email_text,
            "prediction": int(prediction),
            "label": label,
            "confidence": confidence,
            "message": f"Email classified as {label}"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route("/predict", methods=["POST"])
def predict_legacy():
    """Legacy endpoint for backward compatibility"""
    return predict_phishing()

# ============================================================================
# INSTAGRAM ANALYSIS ENDPOINTS
# ============================================================================

@app.route("/instagram/validate", methods=["GET"])
def validate_instagram_service():
    """Validates Instagram service configuration"""
    try:
        instagram_service = InstagramService.create_service()
        validation_result = instagram_service.validate_token()
        
        if validation_result["valid"]:
            return jsonify({
                "valid": True,
                "message": "Instagram service is properly configured",
                "details": validation_result
            })
        else:
            return jsonify({
                "valid": False,
                "error": validation_result.get("error", "Validation failed")
            }), 500
            
    except Exception as e:
        return jsonify({
            "valid": False,
            "error": f"Service configuration error: {str(e)}"
        }), 500

@app.route("/instagram/analyze", methods=["POST"])
def analyze_instagram():
    """Analyzes Instagram profile for PII exposure"""
    try:
        data = request.get_json()
        username = data.get("username", "").strip()

        if not username:
            return jsonify({"error": "Username is required"}), 400

        print(f"[INFO] Starting analysis for @{username}")

        # Initialize services
        instagram_service = InstagramService.create_service()
        pii_engine = PIIEngine()
        risk_model = RiskModel()

        # Get Instagram data
        user_data = instagram_service.get_user_data(username)
        print(f"[OK] Retrieved data for @{username}")
        
        # Extract text content for analysis
        text_content = instagram_service.extract_text_content(user_data)
        print(f"[INFO] Extracted text content: {len(text_content.get('posts', []))} posts")
        
        # Run PII analysis
        findings = pii_engine.scan_for_pii(text_content)
        print(f"[WARNING] Found {len(findings)} PII findings")
        
        # Calculate risk assessment
        analysis_data = [{"platform": "instagram", "findings": findings}]
        risk_score = risk_model.calculate_risk_score(analysis_data)
        risk_level = risk_model.get_risk_level(risk_score)
        recommendations = risk_model.generate_recommendations(analysis_data)
        
        print(f"[INFO] Risk score: {risk_score}/100 ({risk_level})")
        
        # Prepare response
        response_data = {
            "success": True,
            "userData": user_data,
            "textContent": text_content,
            "findings": findings,
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "recommendations": recommendations[:8],  # Limit to top 8
            "totalFindings": len(findings),
            "severityBreakdown": pii_engine.get_summary(findings),
            "profileStats": {
                "postsAnalyzed": len(text_content.get("posts", [])),
                "commentsAnalyzed": len(text_content.get("comments", [])),
                "totalTextLength": len(" ".join([
                    text_content.get("bio", ""),
                    *text_content.get("posts", []),
                    *text_content.get("comments", [])
                ])),
                "hasProfilePicture": bool(user_data.get("user", {}).get("profilePictureUrl")),
                "isVerified": user_data.get("user", {}).get("isVerified", False)
            }
        }
        
        return jsonify(response_data)

    except ValueError as e:
        error_msg = f"Configuration error: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({"success": False, "error": error_msg}), 500
    except Exception as e:
        error_msg = f"Analysis failed: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({"success": False, "error": error_msg}), 500

# ============================================================================
# FACEBOOK ANALYSIS ENDPOINTS
# ============================================================================

@app.route("/facebook/validate", methods=["GET"])
def validate_facebook_service():
    """Validates Facebook service configuration"""
    try:
        facebook_service = FacebookService.create_service()
        validation_result = facebook_service.validate_token()
        
        if validation_result["valid"]:
            return jsonify({
                "valid": True,
                "message": "Facebook service is properly configured",
                "details": validation_result
            })
        else:
            return jsonify({
                "valid": False,
                "error": validation_result.get("error", "Validation failed")
            }), 500
            
    except Exception as e:
        return jsonify({
            "valid": False,
            "error": f"Service configuration error: {str(e)}"
        }), 500

@app.route("/facebook/analyze", methods=["POST"])
def analyze_facebook():
    """Analyzes Facebook page for PII exposure"""
    try:
        data = request.get_json()
        page_url = data.get("pageUrl", "").strip()

        if not page_url:
            return jsonify({"error": "Page URL is required"}), 400

        print(f"[INFO] Starting Facebook analysis for {page_url}")

        # Initialize services
        facebook_service = FacebookService.create_service()
        pii_engine = PIIEngine()
        risk_model = RiskModel()

        # Get Facebook data
        user_data = facebook_service.get_user_data(page_url)
        print(f"[INFO] Retrieved data for {user_data.get('user', {}).get('name', 'Unknown')}")
        
        # Extract text content for analysis
        text_content = facebook_service.extract_text_content(user_data)
        print(f"[INFO] Extracted text content: {len(text_content.get('posts', []))} posts")
        
        # Run PII analysis
        findings = pii_engine.scan_for_pii(text_content)
        print(f"[WARNING] Found {len(findings)} PII findings")
        
        # Calculate risk assessment
        analysis_data = [{"platform": "facebook", "findings": findings}]
        risk_score = risk_model.calculate_risk_score(analysis_data)
        risk_level = risk_model.get_risk_level(risk_score)
        recommendations = risk_model.generate_recommendations(analysis_data)
        
        print(f"[INFO] Risk score: {risk_score}/100 ({risk_level})")
        
        # Prepare response
        response_data = {
            "success": True,
            "userData": user_data,
            "textContent": text_content,
            "findings": findings,
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "recommendations": recommendations[:8],  # Limit to top 8
            "totalFindings": len(findings),
            "severityBreakdown": pii_engine.get_summary(findings),
            "profileStats": {
                "postsAnalyzed": len(text_content.get("posts", [])),
                "commentsAnalyzed": len(text_content.get("comments", [])),
                "totalTextLength": len(" ".join([
                    text_content.get("bio", ""),
                    *text_content.get("posts", []),
                    *text_content.get("comments", [])
                ])),
                "hasProfilePicture": bool(user_data.get("user", {}).get("profilePictureUrl")),
                "isVerified": user_data.get("user", {}).get("isVerified", False)
            }
        }
        
        return jsonify(response_data)

    except ValueError as e:
        error_msg = f"Configuration error: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({"success": False, "error": error_msg}), 500
    except Exception as e:
        error_msg = f"Analysis failed: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({"success": False, "error": error_msg}), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("  UNIFIED SECURITY TOOLS BACKEND")
    print("=" * 70)
    
    # Check configuration
    print("\n[INFO] Service Status:")
    print("-" * 70)
    
    # Phishing detection
    if phishing_model and vectorizer:
        print("[OK] Phishing Detection: READY")
    else:
        print("[ERROR] Phishing Detection: MODEL NOT LOADED")
        print("   Run 'python train_model.py' to train the model")
    
    # Social media analyzers
    apify_token = os.getenv("APIFY_TOKEN")
    if apify_token and apify_token != "your_apify_token_here":
        print("[OK] Instagram Analyzer: READY")
        print("[OK] Facebook Analyzer: READY")
    else:
        print("[WARNING] Instagram Analyzer: APIFY_TOKEN not configured")
        print("[WARNING] Facebook Analyzer: APIFY_TOKEN not configured")
        print("   Get your token from: https://console.apify.com/account/integrations")
    
    print("-" * 70)
    print("\n[STARTING] Server on http://localhost:5000")
    print("   Frontend should connect to: http://localhost:5000")
    print("\n[INFO] Available endpoints:")
    print("   - GET  /health")
    print("   - POST /phishing/predict")
    print("   - GET  /instagram/validate")
    print("   - POST /instagram/analyze")
    print("   - GET  /facebook/validate")
    print("   - POST /facebook/analyze")
    print("\n[INFO] Press Ctrl+C to stop\n")
    
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

