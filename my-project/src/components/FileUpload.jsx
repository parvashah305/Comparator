// import { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import axios from "axios";

// const FileUpload = ({ onResult }) => {
//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([null, null]);
//   const [loading, setLoading] = useState(false);
//   const [summary, setSummary] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: ".pdf, .txt, .docx",
//     onDrop: (acceptedFiles) => {
//       if (files.length + acceptedFiles.length > 2) {
//         alert("You can only upload two files.");
//         return;
//       }

//       const updatedFiles = [...files, ...acceptedFiles].slice(0, 2);
//       setFiles(updatedFiles);
//       generatePreviews(updatedFiles);
//     },
//   });

//   const generatePreviews = (files) => {
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setPreviews(previews);
//   };

//   const handleUpload = async () => {
//     if (files.length !== 2) {
//       alert("Upload two files before comparing.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file1", files[0]);
//     formData.append("file2", files[1]);

//     try {
//       setLoading(true);
//       const response = await axios.post("http://localhost:3000/api/compare", formData);
//       onResult(response.data);
//       setSummary(response.data.summary);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Comparison failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
//       <div
//         {...getRootProps()}
//         className="p-6 border-2 border-dashed border-gray-400 text-center cursor-pointer bg-white rounded-md"
//       >
//         <input {...getInputProps()} />
//         <p className="text-gray-700">Drag & drop files here, or click to select (Max: 2 files).</p>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mt-4">
//         {previews.map((preview, index) =>
//           preview ? (
//             <iframe
//               key={index}
//               src={preview}
//               className="w-full h-[800px] border rounded-md"
//               title={`File Preview ${index + 1}`}
//             />
//           ) : (
//             <div
//               key={index}
//               className="w-full h-40 flex items-center justify-center border rounded-md text-gray-500"
//             >
//               No file uploaded
//             </div>
//           )
//         )}
//       </div>

//       <div className="mt-4 flex gap-4">
//         <button
//           className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           onClick={handleUpload}
//           disabled={files.length !== 2 || loading}
//         >
//           {loading ? "Comparing..." : "Compare Files"}
//         </button>

//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//           onClick={() => setShowModal(true)}
//           disabled={!summary}
//         >
//           Generate Summary
//         </button>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg overflow-y-auto max-h-[80vh]">
//             <h2 className="text-xl font-semibold mb-4">Summary</h2>
//             <pre className="whitespace-pre-wrap text-gray-700">{summary}</pre>
//             <button
//               className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//               onClick={() => setShowModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;



import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = ({ onResult }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .txt, .docx",
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 2) {
        alert("You can only upload two files.");
        return;
      }

      const updatedFiles = [...files, ...acceptedFiles].slice(0, 2);
      setFiles(updatedFiles);
      generatePreviews(updatedFiles);
    },
  });

  const generatePreviews = (files) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviews(previews);
  };

  const handleUpload = async () => {
    if (files.length !== 2) {
      alert("Upload two files before comparing.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", files[0]);
    formData.append("file2", files[1]);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/compare", formData);
      onResult(response.data); // This contains full comparison + summary
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error:", error);
      alert("Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    if (files.length !== 2) {
      alert("Upload two files before generating summary.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", files[0]);
    formData.append("file2", files[1]);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/summarize-files", formData);
      onResult(response.data); 
    } catch (error) {
      console.error("Summary Error:", error);
      alert("Failed to get summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <div
        {...getRootProps()}
        className="p-6 border-2 border-dashed border-gray-400 text-center cursor-pointer bg-white rounded-md"
      >
        <input {...getInputProps()} />
        <p className="text-gray-700">Drag & drop files here, or click to select (Max: 2 files).</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {previews.map((preview, index) =>
          preview ? (
            <iframe
              key={index}
              src={preview}
              className="w-full h-[800px] border rounded-md"
              title={`File Preview ${index + 1}`}
            />
          ) : (
            <div
              key={index}
              className="w-full h-40 flex items-center justify-center border rounded-md text-gray-500"
            >
              No file uploaded
            </div>
          )
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {/* Compare Files */}
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleUpload}
          disabled={files.length !== 2 || loading}
        >
          {loading ? "Comparing..." : "Compare Files"}
        </button>

        {/* Generate Summary (modal for difference summary) */}
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => setShowModal(true)}
          disabled={!summary}
        >
          Generate Summary
        </button>

        {/* 🆕 Get Summary (of both files) */}
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          onClick={handleGetSummary}
          disabled={files.length !== 2 || loading}
        >
          {loading ? "Getting Summary..." : "Get Summary"}
        </button>
      </div>

      {/* Summary Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <pre className="whitespace-pre-wrap text-gray-700">{summary}</pre>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
