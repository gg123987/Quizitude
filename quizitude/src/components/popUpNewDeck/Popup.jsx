import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import './popup.css'; 
import fetchLLMResponse from '../../API/LLM2';


const Popup = ({ handleClosePopup }) => {
  // State variables
  const [cardTitle, setCardTitle] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [questionType, setQuestionType] = useState('');
  const [pdf, setFile] = useState(null);
  const maxPDFSize = 30 * 1024 * 1024; // 30 MB in bytes

  // Event handlers 
  const handleCardTitleChange = (event) => {
    setCardTitle(event.target.value);
  };

  const handleNoOfQuestionsChange = (event) => {
    setNoOfQuestions(event.target.value);
  }

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handlePDFChange = (event) => {
    const uploadedPDF = event.target.files[0];
    if (uploadedPDF) {
      if (uploadedPDF.size <= maxPDFSize) {
        setFile(uploadedPDF);
      } else {
        setFile(null);
        alert('File size exceeds the maximum allowed size (30MB).');
      }
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // when you press the bin it won't open the upload file menu
    setFile(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    
    // Check if more than one file was dropped
    if (droppedFiles.length > 1) {
      alert('Please drop only one file at a time.');
      return; 
    }
    
    // Check if any files were dropped
    if (droppedFiles.length === 1) {
      const droppedFile = droppedFiles[0];
      
      // Check if the dropped file is a PDF under 30MB
      if (droppedFile.type === 'application/pdf' && droppedFile.size <= maxPDFSize) {
        setFile(droppedFile);
      } else {
        setFile(null);
        alert('Please drop a valid PDF file (max. 30MB).');
      }
    }
  };

  // Handler function for the "Generate Flashcards" button click event
  const handleGenerateFlashcards = () => {
      // Check if PDF and number of questions are present
      if (pdf && noOfQuestions) {
        // Call fetchLLMResponse function and pass the required parameters
        fetchLLMResponse(noOfQuestions, pdf, questionType);
      } else {
        // Handle case where PDF or number of questions is missing
        alert('Please upload a PDF and enter the number of questions.');
      }
    };
  

  return (
    <div className="popup-background">
      <div className="popup">
        <IconButton className="closeButton" onClick={handleClosePopup} size="large">
          <CloseIcon fontSize="large" />
        </IconButton>
        <div className="header">
          <h2>Generate Flashcards</h2>
          <p>This creates a deck of cards based on any material you upload here.</p>
        </div>
        <div className="textfields-container">
          <div className="textfield-wrapper">
            <TextField
              id="titleOfCard"
              value={cardTitle}
              label="Title of Card"
              className="titleOfCard"
              onChange={handleCardTitleChange}
              fullWidth
            />
          </div>
          <div className="textfield-wrapper">
            <TextField
              id="noOfQuestions"
              value={noOfQuestions}
              label="No of Questions"
              className="NoOfQuestions"
              type="number"
              onChange={handleNoOfQuestionsChange}
              fullWidth
            />
          </div>
        </div>
          <FormControl fullWidth>
            <InputLabel id="typeOfQuestion">Type of Question</InputLabel>
            <Select
              id="typeOfQuestion"
              value={questionType}
              label="Type of Question"
              onChange={handleQuestionTypeChange}
            >
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              <MenuItem value="short-answer">Short Answer</MenuItem>
            </Select>
          </FormControl>
        <div
          className={`upload-container ${pdf}`} // Add class name based on whether a PDF is uploaded
          onClick={() => document.getElementById('pdf-upload').click()}  // Open file upload dialog
          onDragOver={(e) => e.preventDefault()}  // Prevent pdf opening in the browser
          onDragLeave={(e) => e.preventDefault()} // Prevent pdf opening in the browser
          onDrop={handleDrop}
        >
          {!pdf && (
            <>
              <CloudUploadIcon className="upload-icon" />
              <div className="upload-text">Click to upload or drag and drop</div>
              <div className="upload-text">PDF only (max. 30MB)</div>
            </>
          )}
          {pdf && (
            <div className="pdf-info">
              <strong>{pdf.name}</strong><br />
              {pdf.size > 1024 * 1024 // Check if pdf size is greater than 1 MB
                ? `${(pdf.size / (1024 * 1024)).toFixed(2)} MB` // Display size in MB 
                : `${Math.round(pdf.size / 1024)} KB` // Or display size in KB
              }
              <IconButton className="deleteButton" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
          <input
            type="file"
            id="pdf-upload"
            //value={pdf}
            accept=".pdf"
            onChange={handlePDFChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="generateButton">
        <Button
          id="generateButton"
          fullWidth
          style={{ backgroundColor: '#303484', color: 'white' }}
          onClick={handleGenerateFlashcards}
        >
          Generate Flashcards
        </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
