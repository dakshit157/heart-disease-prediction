import { BarChart, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <div className="card">
          <h2 className="text-2xl font-bold text-white">About This Model</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 text-teal" />
              <div>
                <p className="font-semibold text-white">Classification Task</p>
                <p className="text-sm text-slate-400">Binary classification (two classes: 0 and 1).</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BarChart className="mt-0.5 h-5 w-5 text-teal" />
              <div>
                <p className="font-semibold text-white">Prediction Classes</p>
                <p className="text-sm text-slate-400">0 = Heart Disease Not Detected by the Model</p>
                <p className="text-sm text-slate-400">1 = Heart Disease Detected by the Model</p>
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4 mt-4">
              <p className="font-semibold text-white">Algorithm</p>
              <p className="text-sm text-slate-400">Support Vector Machine (SVC)</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4">
              <p className="font-semibold text-white">Test Accuracy</p>
              <p className="text-sm text-slate-400">85.87%</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4">
              <p className="font-semibold text-white">Dataset</p>
              <p className="text-sm text-slate-400">Cleveland Heart Disease Dataset (11 features, 1 target).</p>
            </div>

            <div className="border-t border-slate-700/50 pt-4">
              <p className="font-semibold text-white">Preprocessing</p>
              <p className="text-sm text-slate-400">
                StandardScaler applied to numeric features. Categorical variables one-hot encoded
                (15 features total after encoding).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-white">Medical Disclaimer</h3>
          <p className="mt-3 text-sm text-slate-400">
            This application is an educational machine learning project. Its predictions are not
            a medical diagnosis and must not be used to rule out or confirm heart disease.
            Consult a qualified healthcare professional for medical concerns.
          </p>
          <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
            <Target className="mt-0.5 h-4 w-4 text-amber-400" />
            <p>
              Do not provide or act on treatment recommendations. This tool is intended for
              educational demonstration of ML model deployment only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
