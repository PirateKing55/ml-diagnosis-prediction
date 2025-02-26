import pickle
import numpy as np
import pandas as pd

model_path = r"D:\basys-imp\ML Initials Core\CancerPredict.pkl"

with open(model_path, "rb") as f:
    model = pickle.load(f, errors="ignore")
    print("Model loaded successfully!")

    # print (type (model)) 

    # print (model.feature_names_in_)
    # print(model.classes_)

input_data = pd.DataFrame([{
    "pipeline__AGE": 45,   # Example age
    "pipeline__FRW": 3.2,  # Example feature
    "pipeline__SBP": 120,  # Systolic BP
    "pipeline__DBP": 80,   # Diastolic BP
    "pipeline__CHOL": 200, # Cholesterol level
    "pipeline__CIG": 10,   # Cigarette consumption
    "onehotencoder__sex_Male": 1  # Male = 1, Female = 0 (assuming one-hot encoding)
}])

prediction = model.predict_proba(input_data)
print("Prediction:", prediction)

input_data_0 = pd.DataFrame([{
    "pipeline__AGE": 25,    # Younger age (lower risk)
    "pipeline__FRW": 5.0,   # More physical activity
    "pipeline__SBP": 110,   # Lower systolic BP
    "pipeline__DBP": 70,    # Lower diastolic BP
    "pipeline__CHOL": 150,  # Lower cholesterol
    "pipeline__CIG": 0,     # No smoking
    "onehotencoder__sex_Male": 0  # Female (if this affects risk)
}])

prediction_0 = model.predict(input_data_0)
print("Prediction:", prediction_0)

