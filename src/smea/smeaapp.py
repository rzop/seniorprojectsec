#!/usr/bin/env python3
"""
SMEA (Social Media Exposure Analyzer) Standalone Server
Run directly from the SMEA folder
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from instagram_service import InstagramService
from pii_engine import PIIEngine
from risk_model import RiskModel

# Load environment variables from local .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend (React) to connect

@app.route("/")
def home():
    return jsonify({
        "message": "SMEA Instagram Privacy Analyzer is running!",
        "version": "1.0.0",
        "endpoints": {
            "validate": "/instagram/validate",
            "analyze": "/instagram/analyze",
            "health": "/health"
        }
    })

@app.route("/instagram/validate", methods=["GET"])
def validate_instagram_service():
    """
    Validate Instagram service configuration
    """
    try:
        instagram_service = InstagramService.create_service()
        validation_result = instagram_service.validate_token()
        
        if validation_result["valid"]:
            return jsonify({
                "valid": True,
                "message": "Instagram service is properly configured"
            })
        else:
            return jsonify({
                "valid": False,
                "error": validation_result["error"]
            }), 500
            
    except Exception as e:
        return jsonify({
            "valid": False,
            "error": f"Service configuration error: {str(e)}"
        }), 500

@app.route("/instagram/analyze", methods=["POST"])
def analyze_instagram():
    """
    Analyze Instagram profile for PII exposure
    """
    try:
        data = request.get_json()
        username = data.get("username", "").strip()

        if not username:
            return jsonify({"error": "Username is required"}), 400

        print(f"Starting analysis for @{username}")

        # Initialize services
        instagram_service = InstagramService.create_service()
        pii_engine = PIIEngine()
        risk_model = RiskModel()

        # Get Instagram data
        user_data = instagram_service.get_user_data(username)
        print(f"Retrieved data for @{username}")
        
        # Extract text content for analysis
        text_content = instagram_service.extract_text_content(user_data)
        print(f"Extracted text content: {len(text_content.get('posts', []))} posts")
        
        # Run PII analysis
        findings = pii_engine.scan_for_pii(text_content)
        print(f"Found {len(findings)} PII findings")
        
        # Calculate risk assessment
        analysis_data = [{"platform": "instagram", "findings": findings}]
        risk_score = risk_model.calculate_risk_score(analysis_data)
        risk_level = risk_model.get_risk_level(risk_score)
        recommendations = risk_model.generate_recommendations(analysis_data)
        
        print(f"Risk score: {risk_score}/100 ({risk_level})")
        
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
        print(f"❌ {error_msg}")
        return jsonify({"error": error_msg}), 500
    except Exception as e:
        error_msg = f"Analysis failed: {str(e)}"
        print(f"❌ {error_msg}")
        return jsonify({"error": error_msg}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint
    """
    apify_token_configured = bool(os.getenv("APIFY_TOKEN"))
    
    return jsonify({
        "status": "healthy",
        "service": "SMEA Instagram Privacy Analyzer",
        "version": "1.0.0",
        "services": {
            "instagram_analysis": apify_token_configured
        },
        "configuration": {
            "apify_token_set": apify_token_configured,
            "cors_enabled": True
        }
    })

if __name__ == "__main__":
    print("SMEA Instagram Privacy Analyzer")
    print("=" * 50)
    
    # Check configuration
    apify_token = os.getenv("APIFY_TOKEN")
    if not apify_token or apify_token == "your_apify_token_here":
        print("   WARNING: APIFY_TOKEN not configured in .env file")
        print("   Get your token from: https://console.apify.com/account/integrations")
    else:
        print("✅ Apify token configured")
    
    print("\nStarting server on http://localhost:5000")
    print("Frontend should connect to: http://localhost:5000")
    print("Press Ctrl+C to stop\n")
    
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
