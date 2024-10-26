import "./pdfupload.css";
import "./Table.jsx";
import { useState, useEffect } from "react";
import useModal from "@/hooks/useModal";
import { useOutletContext } from "react-router-dom";
import EnhancedTable from "./Table.jsx";
import { deleteFile } from "@/services/fileService.js";
import useFiles from "@/hooks/useFiles.js";

const PDFUploads = () => {
  const { userId } = useOutletContext();
  const { files, loading, error, refetch } = useFiles(userId);
  const { openModalwithFile, modalOpen } = useModal();
  const [selectedFile, setSelectedFile] = useState(null);

  // If modal is closed, refetch
  useEffect(() => {
    if (!modalOpen) {
      refetch();
    }
  }, [modalOpen, refetch]);

  // Function to delete a row
  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Function to generate a PDF
  const handleGenerate = async (file) => {
    console.log("Generating PDF for file:", file);
    setSelectedFile(file); // Set the selected file
    openModalwithFile(file);
  };

  return (
    <div className="table-container">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <EnhancedTable
          data={files}
          onDelete={handleDelete}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
};

export default PDFUploads;
