#!/usr/bin/env python3
"""
Startup script for the unified security tools backend
Checks dependencies and starts the server
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """checks if Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print("Python 3.8 or higher is required")
        print(f"   Current version: {sys.version}")
        return False
    print(f"Python version: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_env_file():
    """checks if .env file exists"""
    env_path = Path(__file__).parent / ".env"
    if not env_path.exists():
        print(".env file not found")
        print("   Creating from .env.example...")
        
        example_path = Path(__file__).parent / ".env.example"
        if example_path.exists():
            import shutil
            shutil.copy(example_path, env_path)
            print("Created .env file")
            print("Please edit .env and add your APIFY_TOKEN")
            return False
        else:
            print("❌ .env.example not found")
            return False
    else:
        print("✅ .env file found")
        return True

def check_requirements():
    """checks if required packages are installed"""
    required_packages = [
        'flask',
        'flask_cors',
        'python-dotenv',
        'apify_client',
        'joblib',
        'sklearn'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("⚠️  Missing required packages:")
        for pkg in missing_packages:
            print(f"   - {pkg}")
        print("\n   Run: pip install -r requirements.txt")
        return False
    else:
        print("✅ All required packages installed")
        return True

def check_model_files():
    """checks if phishing detection model files exist"""
    backend_dir = Path(__file__).parent
    model_path = backend_dir / "models" / "phishing_model.pkl"
    vectorizer_path = backend_dir / "models" / "vectorizer.pkl"
    
    if not model_path.exists() or not vectorizer_path.exists():
        print("⚠️  Phishing detection model files not found")
        print("   Phishing detection will be unavailable")
        print("   Run 'python train_model.py' to train the model")
        return False
    else:
        print("✅ Phishing detection model loaded")
        return True

def start_server():
    """starts the unified backend server"""
    try:
        print("\n" + "=" * 70)
        print("🚀 Starting Unified Security Tools Backend...")
        print("=" * 70 + "\n")
        
        # Change to backend directory
        backend_dir = Path(__file__).parent
        os.chdir(backend_dir)
        
        # Start the Flask app
        subprocess.run([sys.executable, "unified_app.py"])
        
    except KeyboardInterrupt:
        print("\n\n⏹  Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        return False
    
    return True

def main():
    print("\n" + "=" * 70)
    print("  UNIFIED SECURITY TOOLS BACKEND - STARTUP CHECK")
    print("=" * 70 + "\n")
    
    checks_passed = True
    
    # runs all checks
    checks_passed &= check_python_version()
    checks_passed &= check_requirements()
    checks_passed &= check_env_file()
    check_model_files()  
    
    print("\n" + "=" * 70)
    
    if not checks_passed:
        print("\n❌ Some checks failed. Please fix the issues above.")
        print("   Then run this script again.\n")
        sys.exit(1)
    
    print("\n✅ All critical checks passed!")
    print("\n" + "=" * 70)
    
    # starts the server
    start_server()

if __name__ == "__main__":
    main()

