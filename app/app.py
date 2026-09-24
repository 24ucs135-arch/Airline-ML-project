"""Flask web application for Airline Customer Satisfaction Prediction.

Provides RESTful endpoints for model metrics, feature metadata,
and real-time inference using the serialized RandomForestClassifier pipeline.
"""

import json
import os
from pathlib import Path
import sys
from typing import Any, Dict

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from flask import Flask, jsonify, render_template, request

from src.data_preprocessing import get_feature_metadata
from src.predict import get_predictor

# Setup Flask application with explicit paths
TEMPLATE_DIR = PROJECT_ROOT / "templates"
STATIC_DIR = PROJECT_ROOT / "static"
MODELS_DIR = PROJECT_ROOT / "models"

app = Flask(
    __name__,
    template_folder=str(TEMPLATE_DIR),
    static_folder=str(STATIC_DIR),
)

# Initialize predictor singleton at startup
try:
    predictor = get_predictor()
except Exception as e:
    print(f"Warning: Predictor failed to load at startup: {e}")
    predictor = None


def load_json_file(file_path: Path) -> Dict[str, Any]:
    """Safely load JSON file content or return empty dictionary."""
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
    return {}


@app.route("/")
def index():
    """Render the main interactive dashboard."""
    metrics = load_json_file(MODELS_DIR / "model_metrics.json")
    training_meta = load_json_file(MODELS_DIR / "training_metadata.json")
    feature_meta = get_feature_metadata()

    return render_template(
        "index.html",
        metrics=metrics,
        training_meta=training_meta,
        feature_meta=feature_meta,
    )


@app.route("/api/info", methods=["GET"])
def get_info():
    """Return model metrics, training parameters, and feature schema."""
    metrics = load_json_file(MODELS_DIR / "model_metrics.json")
    training_meta = load_json_file(MODELS_DIR / "training_metadata.json")
    feature_meta = get_feature_metadata()

    return jsonify(
        {
            "status": "success",
            "model_name": "Random Forest Classifier",
            "dataset": "Airline Customer Satisfaction Dataset (129,880 records)",
            "metrics": metrics,
            "training_metadata": training_meta,
            "schema": feature_meta,
        }
    )


@app.route("/api/predict", methods=["POST"])
def predict():
    """Predict customer satisfaction for a single passenger profile."""
    global predictor
    if predictor is None:
        try:
            predictor = get_predictor()
        except Exception as err:
            return jsonify({
                "status": "error",
                "message": f"Model artifact unavailable. Please run train.py first: {str(err)}"
            }), 500

    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Invalid request payload. Content-Type must be application/json."
        }), 400

    input_data = request.get_json()
    if not isinstance(input_data, dict):
        return jsonify({
            "status": "error",
            "message": "Invalid payload format. Expected JSON object of features."
        }), 400

    try:
        result = predictor.predict_single(input_data)
        return jsonify({
            "status": "success",
            "data": result,
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Prediction failed: {str(e)}"
        }), 400


@app.route("/health", methods=["GET"])
def health():
    """Basic health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": predictor is not None
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Airline Satisfaction ML Server on port {port}...")
    app.run(host="127.0.0.1", port=port, debug=False)
