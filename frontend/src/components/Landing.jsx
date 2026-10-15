import { HeartPulse, Stethoscope, Shield } from "lucide-react";

const features = [
  {
    icon: <HeartPulse className="h-6 w-6 text-teal" />,
    title: "Easy Input",
    desc: "Fill in patient details through a clean, guided form with dropdowns for categorical values.",
  },
  {
    icon: <Stethoscope className="h-6 w-6 text-teal" />,
    title: "ML-Based Prediction",
    desc: "A Support Vector Machine model trained on the Cleveland Heart Disease dataset processes your input.",
  },
  {
    icon: <Shield className="h-6 w-6 text-teal" />,
    title: "Instant Results",
    desc: "Get a binary prediction result in seconds, with clear visual feedback.",
  },
];

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-teal/10 p-4 ring-2 ring-teal/30">
              <HeartPulse className="h-12 w-12 text-teal drop-shadow-glow" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">HeartCare AI</h1>
          <p className="mt-4 text-2xl font-semibold text-slate-300">Heart Health Prediction</p>
          <p className="mt-6 text-lg text-slate-400">
            Explore a machine learning model that predicts a binary heart disease outcome
            from health-related measurements.
          </p>
          <button
            onClick={onStart}
            className="mt-8 rounded-lg bg-teal px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-teal/30 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          >
            Start Prediction
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-slate-400">
            Enter the patient's medical measurements in the form below. The Support Vector
            Machine model — trained on the Cleveland Heart Disease dataset — processes the
            standardized features and returns a binary prediction (0 or 1).
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card flex flex-col items-center text-center">
              {f.icon}
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/30 py-6">
        <div className="mx-auto max-w-3xl px-6 text-center text-sm text-slate-500">
          <p>
            This application is an educational machine learning project. Its predictions are
            not a medical diagnosis and must not be used to rule out or confirm heart disease.
            Consult a qualified healthcare professional for medical concerns.
          </p>
        </div>
      </footer>
    </div>
  );
}
