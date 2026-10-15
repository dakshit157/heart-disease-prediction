from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic import ValidationError
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the exported model and scaler
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
model = joblib.load(os.path.join(MODEL_DIR, "heart_disease_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "HeartCare AI Prediction API",
        "docs_url": "/docs",
        "health": "ok"
    }

# Define the expected incoming JSON body matching the original features
class PatientData(BaseModel):
    Age: int = Field(ge=1, le=120, description="Must be between 1 and 120")
    Sex: str = Field(pattern="^[MF]$", description="Must be 'M' or 'F'")
    ChestPainType: str = Field(pattern="^(TA|ATA|NAP|ASY)$", description="Must be TA, ATA, NAP, or ASY")
    RestingBP: float = Field(ge=1, le=300, description="Must be between 1 and 300")
    Cholesterol: float = Field(ge=1, le=1000, description="Must be between 1 and 1000")
    FastingBS: int = Field(ge=0, le=1, description="Must be 0 or 1")
    RestingECG: str = Field(pattern="^(Normal|ST|LVH)$", description="Must be Normal, ST, or LVH")
    MaxHR: int = Field(ge=1, le=250, description="Must be between 1 and 250")
    ExerciseAngina: str = Field(pattern="^(Y|N)$", description="Must be 'Y' or 'N'")
    Oldpeak: float = Field(ge=0, le=10, description="Must be between 0 and 10")
    ST_Slope: str = Field(pattern="^(Up|Flat|Down)$", description="Must be Up, Flat, or Down")

@app.post("/predict")
def predict_heart_disease(data: PatientData):
    # 0. Explicit validation for NaN/infinity (Pydantic ge/le catches most, but be thorough)
    numeric_values = [data.Age, data.RestingBP, data.Cholesterol, data.MaxHR, data.Oldpeak, data.FastingBS]
    for val in numeric_values:
        if val is None or (isinstance(val, float) and (np.isnan(val) or np.isinf(val))):
            raise HTTPException(status_code=400, detail="Invalid numeric value: NaN or infinity not allowed.")

    # 1. Convert input to a DataFrame matching the original schema
    input_df = pd.DataFrame([{
        "Age": data.Age,
        "RestingBP": data.RestingBP,
        "Cholesterol": data.Cholesterol,
        "FastingBS": data.FastingBS,
        "MaxHR": data.MaxHR,
        "Oldpeak": data.Oldpeak,
        "Sex_M": 1 if data.Sex == "M" else 0,
        "ChestPainType_ATA": 1 if data.ChestPainType == "ATA" else 0,
        "ChestPainType_NAP": 1 if data.ChestPainType == "NAP" else 0,
        "ChestPainType_TA": 1 if data.ChestPainType == "TA" else 0,
        "RestingECG_Normal": 1 if data.RestingECG == "Normal" else 0,
        "RestingECG_ST": 1 if data.RestingECG == "ST" else 0,
        "ExerciseAngina_Y": 1 if data.ExerciseAngina == "Y" else 0,
        "ST_Slope_Flat": 1 if data.ST_Slope == "Flat" else 0,
        "ST_Slope_Up": 1 if data.ST_Slope == "Up" else 0
    }])

    # 2. Scale the input data using the pre-trained scaler
    scaled_data = scaler.transform(input_df)

    # 3. Predict
    prediction = model.predict(scaled_data)[0]
    probability = float(model.predict_proba(scaled_data)[0][1]) if hasattr(model, "predict_proba") else None

    return {
        "heart_disease_prediction": int(prediction),
        "confidence_score": probability
    }
