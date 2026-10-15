import { useState } from "react";
import { Send, RotateCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const initialFormData = {
  Age: "",
  Sex: "M",
  ChestPainType: "ATA",
  RestingBP: "",
  Cholesterol: "",
  FastingBS: 0,
  RestingECG: "Normal",
  MaxHR: "",
  ExerciseAngina: "N",
  Oldpeak: "",
  ST_Slope: "Up",
};

const VALIDATION_RULES = {
  Age: { min: 1, max: 120, allowZero: false },
  RestingBP: { min: 1, max: 300, allowZero: false },
  Cholesterol: { min: 1, max: 1000, allowZero: false },
  MaxHR: { min: 1, max: 250, allowZero: false },
  Oldpeak: { min: 0, max: 10, allowZero: true },
  FastingBS: { min: 0, max: 1, allowZero: true },
};

export default function PredictionForm({ onSubmit, onNavigateToAbout }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    if (value === "" || value === undefined || value === null || value === "NaN") {
      return "This field is required.";
    }

    const num = Number(value);
    if (isNaN(num)) {
      return "Please enter a valid number.";
    }

    if (!isFinite(num)) {
      return "Please enter a finite number.";
    }

    if (!rule.allowZero && num === 0) {
      return "Value must be greater than 0.";
    }

    if (num < rule.min) {
      return `Value must be at least ${rule.min}.`;
    }

    if (num > rule.max) {
      return `Value must be at most ${rule.max}.`;
    }

    return null;
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    for (const field of Object.keys(VALIDATION_RULES)) {
      const err = validateField(field, field === "FastingBS" ? Number(formData[field]) : formData[field]);
      if (err) {
        errors[field] = err;
        hasErrors = true;
      }
    }

    setFieldErrors(errors);
    return !hasErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Age: Number(formData.Age),
          Sex: formData.Sex,
          ChestPainType: formData.ChestPainType,
          RestingBP: Number(formData.RestingBP),
          Cholesterol: Number(formData.Cholesterol),
          FastingBS: Number(formData.FastingBS),
          RestingECG: formData.RestingECG,
          MaxHR: Number(formData.MaxHR),
          ExerciseAngina: formData.ExerciseAngina,
          Oldpeak: Number(formData.Oldpeak),
          ST_Slope: formData.ST_Slope,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `Server error (${response.status}). Make sure the backend is running on port 8000.`);
      }

      const data = await response.json();
      if (data.heart_disease_prediction === undefined) {
        throw new Error("Unexpected response format from server.");
      }
      onSubmit(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError("");
    setFieldErrors({});
  };

  const getInputClass = (field) =>
    fieldErrors[field] ? "input-field error" : "input-field";

  const getSelectClass = (field) =>
    fieldErrors[field] ? "select-field error" : "select-field";

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-white">Patient Information</h2>
          <p className="mt-1 text-sm text-slate-400">
            Fill in the patient details to get a prediction.
          </p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-teal">Basic Info</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Age (years) *</label>
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    className={getInputClass("Age")}
                    placeholder="e.g. 45"
                    min="1"
                    max="120"
                    step="1"
                    required
                  />
                  {fieldErrors.Age && <p className="field-error">{fieldErrors.Age}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Sex *</label>
                  <select name="Sex" value={formData.Sex} onChange={handleChange} className={getSelectClass("Sex")} required>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Chest Pain Type *</label>
                <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange} className={getSelectClass("ChestPainType")} required>
                  <option value="ATA">Atypical Angina (ATA)</option>
                  <option value="NAP">Non-Anginal Pain (NAP)</option>
                  <option value="ASY">Asymptomatic (ASY)</option>
                  <option value="TA">Typical Angina (TA)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Resting Blood Pressure (mm Hg) *</label>
                  <input
                    type="number"
                    name="RestingBP"
                    value={formData.RestingBP}
                    onChange={handleChange}
                    className={getInputClass("RestingBP")}
                    placeholder="e.g. 120"
                    min="1"
                    max="300"
                    step="1"
                    required
                  />
                  {fieldErrors.RestingBP && <p className="field-error">{fieldErrors.RestingBP}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Cholesterol (mm/dl) *</label>
                  <input
                    type="number"
                    name="Cholesterol"
                    value={formData.Cholesterol}
                    onChange={handleChange}
                    className={getInputClass("Cholesterol")}
                    placeholder="e.g. 200"
                    min="1"
                    max="1000"
                    step="1"
                    required
                  />
                  {fieldErrors.Cholesterol && <p className="field-error">{fieldErrors.Cholesterol}</p>}
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-teal">Medical History</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Fasting Blood Sugar &gt; 120 mg/dl *</label>
                  <select name="FastingBS" value={formData.FastingBS} onChange={handleChange} className={getSelectClass("FastingBS")} required>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Resting ECG *</label>
                  <select name="RestingECG" value={formData.RestingECG} onChange={handleChange} className={getSelectClass("RestingECG")} required>
                    <option value="Normal">Normal</option>
                    <option value="ST">ST-T Wave Abnormality</option>
                    <option value="LVH">Left Ventricular Hypertrophy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Maximum Heart Rate Achieved *</label>
                  <input
                    type="number"
                    name="MaxHR"
                    value={formData.MaxHR}
                    onChange={handleChange}
                    className={getInputClass("MaxHR")}
                    placeholder="e.g. 150"
                    min="1"
                    max="250"
                    step="1"
                    required
                  />
                  {fieldErrors.MaxHR && <p className="field-error">{fieldErrors.MaxHR}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Exercise-Induced Angina *</label>
                  <select name="ExerciseAngina" value={formData.ExerciseAngina} onChange={handleChange} className={getSelectClass("ExerciseAngina")} required>
                    <option value="N">No</option>
                    <option value="Y">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">ST Depression (Oldpeak) *</label>
                  <input
                    type="number"
                    name="Oldpeak"
                    value={formData.Oldpeak}
                    onChange={handleChange}
                    className={getInputClass("Oldpeak")}
                    placeholder="e.g. 1.5"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />
                  {fieldErrors.Oldpeak && <p className="field-error">{fieldErrors.Oldpeak}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">ST Slope *</label>
                  <select name="ST_Slope" value={formData.ST_Slope} onChange={handleChange} className={getSelectClass("ST_Slope")} required>
                    <option value="Up">Upsloping</option>
                    <option value="Flat">Flat</option>
                    <option value="Down">Downsloping</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-between sm:items-center">
              <button
                type="button"
                onClick={onNavigateToAbout}
                className="nav-link self-start sm:self-auto"
              >
                About This Model
              </button>
              <div className="flex gap-4">
                <button type="button" onClick={handleReset} disabled={loading} className="reset-btn">
                  <div className="flex items-center gap-2">
                    <RotateCw className="h-4 w-4" />
                    Reset
                  </div>
                </button>
                <button type="submit" disabled={loading} className="predict-btn">
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Predict
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 card text-center">
          <p className="text-sm text-slate-500">
            This application is an educational machine learning project. Its predictions are
            not a medical diagnosis and must not be used to rule out or confirm heart disease.
            Consult a qualified healthcare professional for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
