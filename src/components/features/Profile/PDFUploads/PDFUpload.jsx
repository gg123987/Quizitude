import "./pdfupload.css";
import "./Table.jsx";
import { useState, useEffect } from "react";
import useModal from "@/hooks/useModal";
import { useOutletContext } from "react-router-dom";
import EnhancedTable from "./Table.jsx";
import { deleteFile } from "@/services/fileService.js";
import useFiles from "@/hooks/useFiles.js";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * PDFUploads component handles the display and management of PDF files for a user.
 * It fetches the files, displays them in a table, and provides options to delete or generate PDFs.
 *
 * @component
 * @example
 * return (
 *   <PDFUploads />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * - Fetches user files using `useFiles` hook.
 * - Opens a modal to generate a PDF using `useModal` hook.
 * - Refetches files when the modal is closed.
 * - Handles file deletion and PDF generation.
 *
 * @function
 * @name PDFUploads
 *
 * @hook
 * @name useOutletContext
 * @description Retrieves the userId from the outlet context.
 *
 * @hook
 * @name useFiles
 * @param {string} userId - The ID of the user whose files are being fetched.
 * @returns {Object} An object containing files, loading state, error state, and refetch function.
 *
 * @hook
 * @name useModal
 * @returns {Object} An object containing functions to open the modal with a file and the modal's open state.
 *
 * @hook
 * @name useState
 * @param {null} initialState - The initial state for the selected file.
 * @returns {Array} An array containing the selected file and a function to set it.
 *
 * @hook
 * @name useEffect
 * @param {Function} effect - The effect to run when dependencies change.
 * @param {Array} dependencies - The dependencies array.
 *
 * @function
 * @name handleDelete
 * @description Deletes a file and refetches the file list.
 * @param {string} fileId - The ID of the file to delete.
 *
 * @function
 * @name handleGenerate
 * @description Generates a PDF for the selected file and opens the modal.
 * @param {Object} file - The file object for which to generate a PDF.
 *
 * @returns {JSX.Element} The rendered component.
 */
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
      {loading && <CircularProgress color="inherit" />}
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
