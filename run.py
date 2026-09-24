"""Convenience entrypoint to launch the Airline Customer Satisfaction web application.

Usage:
    python run.py
"""

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.app import app

if __name__ == "__main__":
    print("=" * 65)
    print("  AIRLINE CUSTOMER SATISFACTION - WEB APPLICATION")
    print("  Open your browser and navigate to: http://127.0.0.1:5000")
    print("=" * 65)
    app.run(host="127.0.0.1", port=5000, debug=False)
