1. Install Python Dependencies
cd backend
pip install -r requirements.txt


2. Train Phishing Detection Model 
If you want phishing detection to work:
python train_model.py


Running the Server

Option 1: Simple Start
python unified_app.py


Option 2: Startup Script with Checks (Recommended)
python start_backend.py

The startup script will:
- Check Python version
- Verify required packages
- Check .env file
- Verify model files
- Start the server

---

