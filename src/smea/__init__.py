import sys
from dotenv import load_dotenv

# adds the src directory to the Python path so we can import from smea
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from smea.instagram_service import InstagramService
from smea.pii_engine import PIIEngine
from smea.risk_model import RiskModel

# loads environment variables from the SMEA folder
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'src', 'smea', '.env'))

