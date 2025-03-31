import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = ({ onResult }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([null, null]);

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
      const response = await axios.post("http://localhost:3000/api/compare", formData);
      onResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Comparison failed.");
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
            <div key={index} className="w-full h-40 flex items-center justify-center border rounded-md text-gray-500">
              No file uploaded
            </div>
          )
        )}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleUpload}
        disabled={files.length !== 2}
      >
        Compare Files
      </button>
    </div>
  );
};

export default FileUpload;