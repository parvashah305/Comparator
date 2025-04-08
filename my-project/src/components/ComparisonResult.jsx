// import React from "react";

// const ComparisonResult = ({ result }) => {
//   if (!result || !result.modified || result.modified.length === 0) {
//     console.log("Error: Missing result data", result);
//     return <p className="text-red-500">⚠ No valid comparison data available.</p>;
//   }

//   console.log("Received result:", result);

//   return (
//     <div className="mt-6 p-6 bg-white shadow-md rounded-md">
//       <h2 className="text-xl font-bold text-gray-800 mb-4">Comparison Results</h2>

//       <div className="grid grid-cols-2 gap-6">
        
//         <div className="bg-red-50 p-4 rounded-md">
//           <h3 className="text-red-700 font-semibold"> File 1 (Original)</h3>
//           {result.modified.map((change, index) => (
//             <p key={index} 
//                className="text-gray-800" 
//                dangerouslySetInnerHTML={{ __html: highlightDifferences(change.old, change.new, "file1") }} 
//             />
//           ))}
//         </div>

//         <div className="bg-green-50 p-4 rounded-md">
//           <h3 className="text-green-700 font-semibold"> File 2 (Updated)</h3>
//           {result.modified.map((change, index) => (
//             <p key={index} 
//                className="text-gray-800" 
//                dangerouslySetInnerHTML={{ __html: highlightDifferences(change.old, change.new, "file2") }} 
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const highlightDifferences = (oldText, newText, fileType) => {
//   if (!oldText || !newText) return "";

//   let oldWords = oldText.split(" ");
//   let newWords = newText.split(" ");

//   return oldWords
//     .map((word, index) => {
//       if (fileType === "file1" && word !== newWords[index]) {
//         return `<span class="text-red-600 line-through">${word}</span>`; 
//       }
//       if (fileType === "file2" && word !== newWords[index]) {
//         return `<span class="text-green-600 font-bold">${newWords[index]}</span>`; 
//       }
//       return word;
//     })
//     .join(" ");
// };

// export default ComparisonResult;




import React from "react";

const ComparisonResult = ({ result }) => {
  if (
    !result ||
    !result.lineByLineComparison ||
    !result.lineByLineComparison.modified ||
    result.lineByLineComparison.modified.length === 0
  ) {
    console.log("Error: Missing result data", result);
    return <p className="text-red-500">⚠ No valid comparison data available.</p>;
  }

  const modifiedChanges = result.lineByLineComparison.modified;

  return (
    <div className="mt-6 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Comparison Results</h2>

      <div className="grid grid-cols-2 gap-6">
        
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-red-700 font-semibold"> File 1 (Original)</h3>
          {modifiedChanges.map((change, index) => (
            <p
              key={index}
              className="text-gray-800"
              dangerouslySetInnerHTML={{
                __html: highlightDifferences(change.old, change.new, "file1"),
              }}
            />
          ))}
        </div>

        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="text-green-700 font-semibold"> File 2 (Updated)</h3>
          {modifiedChanges.map((change, index) => (
            <p
              key={index}
              className="text-gray-800"
              dangerouslySetInnerHTML={{
                __html: highlightDifferences(change.old, change.new, "file2"),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const highlightDifferences = (oldText, newText, fileType) => {
  if (!oldText || !newText) return "";

  let oldWords = oldText.split(" ");
  let newWords = newText.split(" ");

  return oldWords
    .map((word, index) => {
      if (fileType === "file1" && word !== newWords[index]) {
        return `<span class="text-red-600 line-through">${word}</span>`;
      }
      if (fileType === "file2" && word !== newWords[index]) {
        return `<span class="text-green-600 font-bold">${newWords[index]}</span>`;
      }
      return word;
    })
    .join(" ");
};

export default ComparisonResult;