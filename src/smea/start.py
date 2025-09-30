#!/usr/bin/env python3
"""
Quick start script for SMEA Instagram Privacy Analyzer
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def check_env_file():
    """Check if .env file exists and has Apify token"""
    if not os.path.exists(".env"):
        print("❌ .env file not found")
        return False
    
    with open(".env", "r") as f:
        content = f.read()
        if "APIFY_TOKEN=" in content and "your_apify_token_here" not in content:
            print("✅ Apify token configured")
            return True
        else:
            print("⚠️  Please set your APIFY_TOKEN in .env file")
            return False

def start_server():
    """Start the Flask server"""
    print("🚀 Starting SMEA server...")
    try:
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    print("🔍 SMEA Instagram Privacy Analyzer Setup")
    print("=" * 50)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Check environment
    env_ok = check_env_file()
    
    if env_ok:
        start_server()
    else:
        print("\n📝 To configure:")
        print("1. Edit .env file")
        print("2. Set APIFY_TOKEN=your_actual_token")
        print("3. Run: python start.py")
