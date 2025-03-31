import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ComparisonResult from "./components/ComparisonResult";

function App() {
  const [comparisonResult, setComparisonResult] = useState(null);

  return (
    <div className="min-h-screen p-8 bg-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">File Comparison Tool</h1>

      <FileUpload onResult={setComparisonResult} />
      <ComparisonResult result={comparisonResult} />
    </div>
  );
}

export default App;