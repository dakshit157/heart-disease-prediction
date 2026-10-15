import { AlertCircle, CheckCircle } from "lucide-react";

export default function Result({ result, onPredictAgain }) {
  const hasDisease = result.heart_disease_prediction === 1;
  const Icon = hasDisease ? AlertCircle : CheckCircle;
  const iconColor = hasDisease ? "text-red-400" : "text-green-400";
  const bgColor = hasDisease ? "bg-red-900/20" : "bg-green-900/20";
  const borderColor = hasDisease ? "border-red-800/50" : "border-green-800/50";
  const textColor = hasDisease ? "text-red-300" : "text-green-300";

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className={`card ${bgColor} ${borderColor}`}>
          <h2 className="text-center text-2xl font-bold text-white">Prediction Result</h2>

          <div className="mt-8 flex flex-col items-center">
            <div className={`rounded-full p-4 ${hasDisease ? "bg-red-900/30" : "bg-green-900/30"}`}>
              <Icon className={`h-10 w-10 ${iconColor} drop-shadow-glow`} />
            </div>

            <p className={`mt-6 text-center text-2xl font-bold ${textColor}`}>
              {hasDisease
                ? "Heart Disease Detected by the Model"
                : "Heart Disease Not Detected by the Model"}
            </p>

            <p className="mt-3 max-w-md text-center text-sm text-slate-400">
              {hasDisease
                ? "The model predicts heart disease based on the input. This is not a medical diagnosis."
                : "The model does not detect heart disease based on the input. This is not a medical confirmation."}
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onPredictAgain}
              className="rounded-lg bg-teal px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal/30 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            >
              Predict Again
            </button>
          </div>
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
