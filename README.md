# AeroPredict - Airline Customer Satisfaction Machine Learning System

A production-grade Machine Learning web application and predictive system built to forecast airline passenger satisfaction based on in-flight experience, flight schedules, customer profiles, and service ratings.

---

## ✈️ 1. Project Overview

AeroPredict leverages an ensemble **Random Forest Classifier** trained on **129,880 verified airline customer flight surveys**. The project includes:
- An end-to-end data preprocessing pipeline with automated median imputation and one-hot encoding.
- Stratified 80/20 train/test partitioning preventing data leakage.
- Comprehensive model evaluation with **95.07% accuracy**, precision, recall, F1 score, ROC-AUC, and confusion matrix visual generation.
- A **Flask REST API** backend serving real-time inferences without retraining.
- A modern, responsive web dashboard with glassmorphism design, real-time probability gauges, preset scenario loaders, and feature importance visualizers.

---

## 📊 2. Dataset Description

The dataset used is `Airline_customer_satisfaction.csv` located directly in the project folder:
- **Total Records**: 129,880 rows
- **Total Columns**: 22 (21 features + 1 target)
- **Target Variable**: `satisfaction`
  - `satisfied`: 71,087 records (54.7%)
  - `dissatisfied`: 58,793 records (45.3%)
- **Task Type**: **Binary Classification**
- **Duplicate Records**: 0 duplicates
- **Missing Values**: 393 missing records in `Arrival Delay in Minutes` (~0.3%), handled via median imputation.

### Feature Partitioning

| Category | Features | Description |
| :--- | :--- | :--- |
| **Categorical** | `Customer Type`, `Type of Travel`, `Class` | Passenger loyalty status, travel intent, flight seating class |
| **Numerical** | `Age`, `Flight Distance`, `Departure Delay in Minutes`, `Arrival Delay in Minutes` | Continuous quantitative flight measurements |
| **Rating (0–5)** | `Seat comfort`, `Food and drink`, `Inflight entertainment`, `Inflight wifi service`, `Online support`, `Ease of Online booking`, `On-board service`, `Leg room service`, `Baggage handling`, `Checkin service`, `Cleanliness`, `Online boarding`, `Departure/Arrival time convenient`, `Gate location` | Customer ordinal experience ratings from 0 (poor/N/A) to 5 (excellent) |

---

## 🤖 3. Machine Learning Algorithm & Preprocessing

- **Algorithm**: `RandomForestClassifier` (`scikit-learn`)
- **Hyperparameters**:
  - `n_estimators`: 100
  - `max_depth`: 16
  - `min_samples_split`: 10
  - `min_samples_leaf`: 4
  - `random_state`: 42
  - `n_jobs`: -1 (multi-core parallel training)
- **Preprocessing Pipeline (`ColumnTransformer`)**:
  - `SimpleImputer(strategy='median')` for continuous numerical features and ratings.
  - `OneHotEncoder(handle_unknown='ignore')` for categorical features.
  - Assembled into a single unified `scikit-learn.pipeline.Pipeline` object serialized as `models/random_forest_model.pkl`.

---

## 📈 4. Model Evaluation Results

Evaluated on **25,976 unseen test records** (20% holdout split):

| Metric | Score | Note |
| :--- | :--- | :--- |
| **Accuracy** | **95.07%** | Correctly predicts satisfaction in 95 out of 100 passengers |
| **Precision** | **96.17%** | Low false positive rate for satisfied classification |
| **Recall** | **94.77%** | High sensitivity identifying satisfied travelers |
| **F1-Score** | **95.46%** | High harmonic balance of precision and recall |
| **ROC - AUC** | **99.15%** | Near-optimal discriminatory threshold power |

### Top 5 Most Impactful Features

1. **Inflight entertainment** (24.67%)
2. **Seat comfort** (15.50%)
3. **Ease of Online booking** (8.25%)
4. **Online support** (7.28%)
5. **On-board service** (4.56%)

### Confusion Matrix

| Actual \ Predicted | Predicted Dissatisfied | Predicted Satisfied |
| :--- | :---: | :---: |
| **Actual Dissatisfied** | **11,222** (TN) | 537 (FP) |
| **Actual Satisfied** | 744 (FN) | **13,473** (TP) |

---

## 🛠️ 5. Technologies Used

- **Core ML**: Python 3.13, Scikit-Learn, Pandas, NumPy, Joblib
- **Visualization**: Matplotlib, Seaborn
- **Backend API**: Flask 3.1
- **Frontend**: Vanilla HTML5, Modern CSS (Glassmorphism, Dark Theme), Vanilla JavaScript (Async Fetch API)

---

## 📁 6. Project Folder Structure

```
shanmu/
├── dataset/
│   └── Airline_customer_satisfaction.csv  # Raw dataset
├── models/
│   ├── random_forest_model.pkl            # Serialized pipeline (preprocessor + model)
│   ├── training_metadata.json             # Hyperparameters & train metadata
│   ├── model_metrics.json                 # Evaluation metrics & confusion matrix
│   └── feature_importance.json            # Ranked feature importances
├── src/
│   ├── __init__.py
│   ├── data_preprocessing.py              # Data loader, validation, ColumnTransformer
│   ├── train_model.py                     # Pipeline construction & training
│   ├── evaluate.py                        # Metrics calculation & chart generation
│   └── predict.py                         # Single & batch inference module
├── app/
│   ├── __init__.py
│   └── app.py                             # Flask application & REST endpoints
├── templates/
│   └── index.html                         # Modern dashboard UI template
├── static/
│   ├── css/
│   │   └── style.css                      # Sleek dark-mode styling & animations
│   ├── js/
│   │   └── script.js                      # Sliders, presets, async prediction handler
│   └── images/
│       ├── confusion_matrix.png           # Generated evaluation plot
│       └── feature_importance.png         # Generated feature importance plot
├── requirements.txt                       # Project dependencies
├── train.py                               # CLI entrypoint to train & evaluate
├── run.py                                 # Web app launcher
└── README.md                              # Complete documentation
```

---

## 🚀 7. Installation & Quickstart

### Prerequisites
- Python 3.9+ (Python 3.10, 3.11, 3.12, 3.13 supported)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the Model (Optional - Already Pre-trained)
To re-run the entire data ingestion, preprocessing, training, evaluation, and chart generation:
```bash
python train.py
```

### 3. Start the Web Application
```bash
python run.py
```
*Alternatively:*
```bash
python app/app.py
```

The web server will start at:
👉 **`http://127.0.0.1:5000`**

---

## 🎯 8. How to Make Predictions

### Via the Web Interface:
1. Open `http://127.0.0.1:5000` in your web browser.
2. Select any quick preset button (**Executive Business**, **Economy Traveler**, or **Delayed & Disloyal**) or manually customize the passenger sliders and dropdowns.
3. Click **Predict Customer Satisfaction**.
4. The system immediately displays:
   - Predicted class: **Satisfied** or **Dissatisfied**
   - Calibrated satisfaction/dissatisfaction probability percentages
   - Key driver insights detailing what influenced the outcome

### Via REST API (`/api/predict`):
Send a `POST` request with a JSON passenger payload:

```bash
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Customer Type": "Loyal Customer",
    "Type of Travel": "Business travel",
    "Class": "Business",
    "Age": 42,
    "Flight Distance": 1800,
    "Seat comfort": 5,
    "Departure/Arrival time convenient": 4,
    "Food and drink": 4,
    "Gate location": 4,
    "Inflight wifi service": 5,
    "Inflight entertainment": 5,
    "Online support": 5,
    "Ease of Online booking": 5,
    "On-board service": 5,
    "Leg room service": 5,
    "Baggage handling": 5,
    "Checkin service": 5,
    "Cleanliness": 5,
    "Online boarding": 5,
    "Departure Delay in Minutes": 0,
    "Arrival Delay in Minutes": 0
  }'
```

**Sample API Response:**
```json
{
  "status": "success",
  "data": {
    "prediction": "satisfied",
    "prediction_code": 1,
    "confidence": 0.9998,
    "confidence_percentage": "100.0%",
    "probabilities": {
      "satisfied": 0.9998,
      "dissatisfied": 0.0002
    },
    "driver_insights": [
      "High inflight entertainment and wifi ratings positively elevate satisfaction.",
      "Seamless digital onboarding and booking experience contributed positively."
    ]
  }
}
```
