# HeartCare AI — Heart Disease Prediction

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://heart-disease-prediction-seven-hazel.vercel.app/)
[![API Docs](https://img.shields.io/badge/API%20Docs-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://heart-disease-backend-v336.onrender.com/docs)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A premium, responsive full-stack web application for heart disease prediction using a Support Vector Machine (SVC) model trained on the Cleveland Heart Disease dataset. Built with **React + Vite**, **Tailwind CSS**, and **FastAPI**.

---

## 🌐 Live Deployment

| Service | Platform | Live URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://heart-disease-prediction-seven-hazel.vercel.app](https://heart-disease-prediction-seven-hazel.vercel.app/) |
| **Backend REST API** | Render | [https://heart-disease-backend-v336.onrender.com](https://heart-disease-backend-v336.onrender.com) |
| **Interactive API Docs** | Swagger UI | [https://heart-disease-backend-v336.onrender.com/docs](https://heart-disease-backend-v336.onrender.com/docs) |

> **Note on Render Free Tier**: If the server has been idle for more than 15 minutes, Render spins down the backend. The very first prediction request may take ~30–45 seconds while the service spins up. Subsequent requests will be instant.

---

## Project Structure

```text
Project 5/
├── backend/
│   ├── app.py                 # FastAPI server & prediction endpoints
│   ├── requirements.txt       # Python dependencies
│   └── models/
│       ├── heart_disease_model.pkl   # Trained SVC model
│       └── scaler.pkl               # Fitted StandardScaler
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application with view routing
│   │   ├── App.css              # Tailwind custom styles & animations
│   │   ├── main.jsx             # React entry point
│   │   ├── vite-env.d.ts        # Vite environment types
│   │   └── components/
│   │       ├── Landing.jsx      # Hero landing page
│   │       ├── PredictionForm.jsx  # Interactive patient input form
│   │       ├── Result.jsx       # Prediction output & risk level display
│   │       └── About.jsx        # Model architecture & medical disclaimer
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   └── .env.example             # Environment variable template
├── data/
│   └── heart.csv                # Cleveland Heart Disease dataset
├── notebooks/
│   └── Heart_Disease_corrected.ipynb  # Model training, analysis & evaluation
├── .gitignore                   # Git exclusion rules
└── README.md
```

---

## Prerequisites

- **Python** 3.8+
- **Node.js** 18+ with npm
- **Git**

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/heart-disease-prediction.git
cd heart-disease-prediction
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

The API will be available locally at `http://localhost:8000` and docs at `http://localhost:8000/docs`.

### 3. Frontend Setup (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Documentation & Usage

### Endpoint: `POST /predict`

Send a JSON payload with patient clinical metrics:

```json
{
  "Age": 40,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 140,
  "Cholesterol": 289,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 172,
  "ExerciseAngina": "N",
  "Oldpeak": 0.0,
  "ST_Slope": "Up"
}
```

### Response

```json
{
  "heart_disease_prediction": 0,
  "confidence_score": null
}
```

- `heart_disease_prediction`: `0` (Heart Disease Not Detected) or `1` (Heart Disease Detected)
- `confidence_score`: `null` (SVC model uses hard-margin decision boundary)

---

## Testing Predictions via cURL

### Test Class 0 (Low Risk / No Heart Disease)

**Against Production (Render):**
```bash
curl -X POST https://heart-disease-backend-v336.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 40,
    "Sex": "M",
    "ChestPainType": "ATA",
    "RestingBP": 140,
    "Cholesterol": 289,
    "FastingBS": 0,
    "RestingECG": "Normal",
    "MaxHR": 172,
    "ExerciseAngina": "N",
    "Oldpeak": 0.0,
    "ST_Slope": "Up"
  }'
```

### Test Class 1 (Elevated Risk / Heart Disease Detected)

**Against Production (Render):**
```bash
curl -X POST https://heart-disease-backend-v336.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 60,
    "Sex": "M",
    "ChestPainType": "ASY",
    "RestingBP": 170,
    "Cholesterol": 300,
    "FastingBS": 1,
    "RestingECG": "ST",
    "MaxHR": 110,
    "ExerciseAngina": "Y",
    "Oldpeak": 2.5,
    "ST_Slope": "Flat"
  }'
```

---

## Model Details

- **Algorithm**: Support Vector Machine (SVC)
- **Dataset**: Cleveland Heart Disease Dataset
- **Classification Task**: Binary classification (0 = No Disease, 1 = Disease Detected)
- **Features**: 11 input fields, transformed to 15 features after one-hot encoding
- **Preprocessing**: `StandardScaler` fitted on training data
- **Test Accuracy**: 85.87%

### Feature Encoding Reference

| Field | Description | Values | One-Hot Encoding |
| :--- | :--- | :--- | :--- |
| `Sex` | Biological sex | `M` / `F` | `Sex_M` (1 if M, else 0) |
| `ChestPainType` | Chest pain classification | `TA`, `ATA`, `NAP`, `ASY` | `ChestPainType_ATA`, `ChestPainType_NAP`, `ChestPainType_TA` (`ASY` = baseline) |
| `RestingECG` | Resting ECG result | `Normal`, `ST`, `LVH` | `RestingECG_Normal`, `RestingECG_ST` (`LVH` = baseline) |
| `ExerciseAngina` | Exercise-induced angina | `Y` / `N` | `ExerciseAngina_Y` (1 if Y, else 0) |
| `ST_Slope` | Peak exercise ST segment slope | `Up`, `Flat`, `Down` | `ST_Slope_Flat`, `ST_Slope_Up` (`Down` = baseline) |

---

## Frontend Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite local development server |
| `npm run build` | Compile optimized production bundle to `dist/` |
| `npm run preview` | Locally preview production build |
| `npm run lint` | Run ESLint syntax checks |

---

## Disclaimer

This application is an educational machine learning project. Its predictions are not a medical diagnosis and must not be used to rule out or confirm heart disease. Always consult a qualified healthcare professional for medical concerns and treatment advice.
