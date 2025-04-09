const SummaryDisplay = ({ result }) => {
    if (!result?.file1?.summary && !result?.file2?.summary) return null;
  
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md overflow-auto">
          <h3 className="text-lg font-bold mb-2 text-blue-600">File 1 Summary</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{result.file1.summary}</pre>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md overflow-auto">
          <h3 className="text-lg font-bold mb-2 text-green-600">File 2 Summary</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{result.file2.summary}</pre>
        </div>
      </div>
    );
  };
  
  export default SummaryDisplay;