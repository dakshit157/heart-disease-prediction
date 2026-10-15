import { useState } from "react";
import Landing from "./components/Landing.jsx";
import PredictionForm from "./components/PredictionForm.jsx";
import Result from "./components/Result.jsx";
import About from "./components/About.jsx";

function App() {
  const [view, setView] = useState("landing");
  const [result, setResult] = useState(null);

  const handlePredictionComplete = (data) => {
    setResult(data);
    setView("result");
  };

  const handlePredictAgain = () => {
    setResult(null);
    setView("form");
  };

  const handleStart = () => {
    setView("form");
  };

  return (
    <>
      {view === "landing" && <Landing onStart={handleStart} />}
      {view === "form" && (
        <PredictionForm onSubmit={handlePredictionComplete} onNavigateToAbout={() => setView("about")} />
      )}
      {view === "result" && result && (
        <Result result={result} onPredictAgain={handlePredictAgain} />
      )}
      {view === "about" && <About />}
    </>
  );
}

export default App;
