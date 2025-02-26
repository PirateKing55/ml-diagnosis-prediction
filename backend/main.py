import sys
import json
import pickle
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATHS = {
    "cancer_prediction": os.path.join(BASE_DIR, "models", "CancerPredict.pkl"),
    "ascvd_prediction": os.path.join(BASE_DIR, "models", "ASCVDPredict.pkl"),
    "cardio_prediction": os.path.join(BASE_DIR, "models", "CardioPredict.pkl"),
    "diabetes_prediction": os.path.join(BASE_DIR, "models", "DiabetesPredict.pkl"),
    "dme_prediction": os.path.join(BASE_DIR, "models", "DMEPredict.pkl"),
    "hypertension_prediction": os.path.join(BASE_DIR, "models", "HypertensionPredict.pkl"),
    "imaging_prediction": os.path.join(BASE_DIR, "models", "ImagingPredict.pkl"),
    "kidney_disease_prediction": os.path.join(BASE_DIR, "models", "KidneyDiseasePredict.pkl"),
    "liver_disease_prediction": os.path.join(BASE_DIR, "models", "LiverDiseasePredict.pkl"),
    "neurology_prediction": os.path.join(BASE_DIR, "models", "NeurologyPredict.pkl"),
}

def run_service(service_name, input_data):
    if service_name not in MODEL_PATHS:
        raise ValueError(f"Unknown service: {service_name}")

    model_path = MODEL_PATHS[service_name]

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    input_df = pd.DataFrame([{
        "pipeline__AGE": input_data["age"],
        "pipeline__FRW": input_data["frw"],
        "pipeline__SBP": input_data["systolicBP"],
        "pipeline__DBP": input_data["diastolicBP"],
        "pipeline__CHOL": input_data["cholesterolLevel"],
        "pipeline__CIG": input_data["cigaretteConsumption"],
        "onehotencoder__sex_Male": input_data["sex"]
    }])

    prediction = model.predict(input_df)
    print(prediction.tolist())  
    return prediction

if __name__ == "__main__":
    service_name = sys.argv[1]
    input_data = json.loads(sys.argv[2])
    run_service(service_name, input_data)
