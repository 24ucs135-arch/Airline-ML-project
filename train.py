"""Main training script for Airline Customer Satisfaction project.

Executes data ingestion, pipeline training with RandomForestClassifier,
comprehensive performance evaluation, and saves serialized artifacts and visualization plots.

Usage:
    python train.py
"""

import sys
from pathlib import Path

# Ensure UTF-8 output encoding if possible
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data_preprocessing import (
    clean_data,
    get_dataset_summary,
    load_data,
    prepare_train_test_split,
)
from src.evaluate import evaluate_model
from src.train_model import train_and_save_model


def main() -> None:
    print("=" * 70)
    print("  AIRLINE CUSTOMER SATISFACTION - MACHINE LEARNING PIPELINE")
    print("=" * 70)

    # 1. Load Data
    print("\n[1/4] Loading and inspecting dataset...")
    df_raw = load_data()
    summary = get_dataset_summary(df_raw)
    print(f"  - Total samples: {summary['total_rows']:,}")
    print(f"  - Total features: {summary['total_columns'] - 1}")
    print(f"  - Target distribution: {summary['target_distribution']}")
    print(f"  - Missing values: {sum(summary['missing_counts'].values())} across all columns")

    # 2. Clean and Split Data
    print("\n[2/4] Preprocessing and partitioning data (80/20 train/test split)...")
    df_clean = clean_data(df_raw)
    X_train, X_test, y_train, y_test = prepare_train_test_split(
        df_clean, test_size=0.2, random_state=42
    )
    print(f"  - Training set: {len(X_train):,} samples")
    print(f"  - Testing set:  {len(X_test):,} samples")

    # 3. Train Model
    print("\n[3/4] Training Random Forest Classifier pipeline...")
    # Best-practice hyperparameters for strong generalization and high speed:
    hyperparameters = {
        "n_estimators": 100,
        "max_depth": 16,
        "min_samples_split": 10,
        "min_samples_leaf": 4,
        "random_state": 42,
        "n_jobs": -1,
    }
    pipeline, model_path = train_and_save_model(
        X_train, y_train, hyperparameters=hyperparameters
    )

    # 4. Evaluate Model
    print("\n[4/4] Evaluating model performance on unseen test data...")
    metrics = evaluate_model(pipeline, X_test, y_test)

    print("\n" + "=" * 70)
    print("   FINAL MODEL EVALUATION RESULTS")
    print("=" * 70)
    print(f"  - Accuracy:         {metrics['accuracy'] * 100:.2f}%")
    print(f"  - Precision:        {metrics['precision'] * 100:.2f}%")
    print(f"  - Recall:           {metrics['recall'] * 100:.2f}%")
    print(f"  - F1-Score:         {metrics['f1_score'] * 100:.2f}%")
    print(f"  - ROC-AUC:          {metrics['roc_auc'] * 100:.2f}%")
    print("\nTop 5 Most Important Features:")
    for i, item in enumerate(metrics["feature_importances"][:5], 1):
        feat_name = item["feature"].replace("num__", "").replace("rating__", "").replace("cat__", "")
        print(f"  {i}. {feat_name:<30} {item['importance'] * 100:5.2f}%")

    print("\nConfusion Matrix:")
    cm = metrics["confusion_matrix"]["matrix"]
    print(f"  True Dissatisfied:  {cm[0][0]:<7} | False Satisfied:   {cm[0][1]}")
    print(f"  False Dissatisfied: {cm[1][0]:<7} | True Satisfied:    {cm[1][1]}")
    print("=" * 70)
    print("[SUCCESS] Training, evaluation, and artifact generation complete!")


if __name__ == "__main__":
    main()
