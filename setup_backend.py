#!/usr/bin/env python3
"""
Setup script for SecuraSphere Instagram Analysis Backend
"""
import os
import subprocess
import sys

def create_env_file():
    """Create .env file with required configuration"""
    env_path = os.path.join('backend', '.env')
    
    if os.path.exists(env_path):
        print(f"✅ {env_path} already exists")
        return
    
    print("Creating backend/.env file...")
    
    # Prompt for Apify token
    apify_token = input("Enter your Apify token (get free one at apify.com): ").strip()
    
    if not apify_token:
        print("❌ Apify token is required")
        return False
    
    env_content = f"""# Apify Configuration
APIFY_TOKEN={apify_token}

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# CORS Configuration
CORS_ORIGINS=http://localhost:3000
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print(f"✅ Created {env_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to create {env_path}: {e}")
        return False

def install_dependencies():
    """Install Python dependencies"""
    print("Installing Python dependencies...")
    
    try:
        subprocess.run([
            sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'
        ], check=True, cwd=os.getcwd())
        print("✅ Python dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_backend():
    """Start the Flask backend server"""
    print("Starting Flask backend server...")
    
    try:
        os.chdir('backend')
        subprocess.run([sys.executable, 'app.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start backend: {e}")
        return False
    except KeyboardInterrupt:
        print("\nBackend server stopped")
        return True

def main():
    print("SecuraSphere Instagram Analysis Backend Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('backend/app.py'):
        print("❌ Please run this script from the project root directory")
        return
    
    # Step 1: Create .env file
    if not create_env_file():
        return
    
    # Step 2: Install dependencies
    if not install_dependencies():
        return
    
    # Step 3: Ask if user wants to start the server
    start_now = input("\nStart the backend server now? (y/n): ").strip().lower()
    
    if start_now == 'y':
        print("\nBackend will start at http://localhost:5000")
        print("Make sure to start your React frontend at http://localhost:3000")
        print("Press Ctrl+C to stop the server\n")
        start_backend()
    else:
        print("\nSetup complete!")
        print("To start the backend later, run:")
        print("cd backend && python app.py")
        print("Make sure both backend (port 5000) and frontend (port 3000) are running")

if __name__ == "__main__":
    main()
