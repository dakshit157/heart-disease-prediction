# HeartCare AI — Heart Disease Prediction

A premium, responsive web application for heart disease prediction using a Support Vector Machine (SVC) model trained on the Cleveland Heart Disease dataset. Built with React + Vite, Tailwind CSS, and FastAPI.

## Project Structure

```
Project 5/
├── backend/
│   ├── app.py                 # FastAPI server
│   ├── requirements.txt       # Python dependencies
│   └── models/
│       ├── heart_disease_model.pkl   # Trained SVC model
│       └── scaler.pkl               # Fitted StandardScaler
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app with view routing
│   │   ├── App.css              # Tailwind directives
│   │   ├── main.jsx             # React entry point
│   │   ├── vite-env.d.ts        # Vite env types
│   │   └── components/
│   │       ├── Landing.jsx      # Landing page
│   │       ├── PredictionForm.jsx  # Patient input form
│   │       ├── Result.jsx       # Prediction result display
│   │       └── About.jsx        # Model info & disclaimer
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example             # Environment variable template
├── data/
│   └── heart.csv                # Cleveland Heart Disease dataset
├── notebooks/
│   ├── Heart_diesease.ipynb     # Initial analysis
│   └── Heart_Disease_corrected.ipynb  # Final model training & evaluation
└── README.md
```

## Prerequisites

- **Python** 3.8+
- **Node.js** 18+ with npm
- **Git** (optional, for cloning)

## Installation

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

### Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
python -m uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### 2. Start the Frontend Dev Server

In a separate terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

### Using a Custom Backend URL

By default, the frontend connects to `http://localhost:8000`. To use a different URL:

```bash
cp .env.example .env
# Edit .env and set your VITE_API_URL
```

## API Usage

### POST `/predict`

Send a JSON request to `http://localhost:8000/predict` with patient data:

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

- `heart_disease_prediction`: `0` (no heart disease) or `1` (heart disease detected)
- `confidence_score`: `null` (SVC model does not support predict_proba)

## Testing Both Prediction Classes

### Test Class 0 (No Heart Disease)

```bash
curl -X POST http://localhost:8000/predict \
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

### Test Class 1 (Heart Disease)

Use values associated with higher risk:

```bash
curl -X POST http://localhost:8000/predict \
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

## Model Details

- **Algorithm**: Support Vector Machine (SVC)
- **Dataset**: Cleveland Heart Disease Dataset
- **Classes**: Binary (0 = no disease, 1 = disease)
- **Features**: 11 input fields, expanded to 15 after one-hot encoding
- **Scaler**: StandardScaler (fitted on training data)
- **Test Accuracy**: 85.87%

## Feature Encoding

The model uses one-hot encoding for categorical variables. The backend (`app.py`) handles this automatically:

| Field | Values | Encoding |
|-------|--------|----------|
| Sex | M / F | `Sex_M` (1 if M, else 0) |
| ChestPainType | TA / ATA / NAP / ASY | One-hot: `ChestPainType_ATA`, `ChestPainType_NAP`, `ChestPainType_TA` (ASY = baseline) |
| RestingECG | Normal / ST / LVH | One-hot: `RestingECG_Normal`, `RestingECG_ST` (LVH = baseline) |
| ExerciseAngina | Y / N | `ExerciseAngina_Y` (1 if Y, else 0) |
| ST_Slope | Up / Flat / Down | One-hot: `ST_Slope_Flat`, `ST_Slope_Up` (Down = baseline) |

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Disclaimer

This application is an educational machine learning project. Its predictions are not a medical diagnosis and must not be used to rule out or confirm heart disease. Consult a qualified healthcare professional for medical concerns.
