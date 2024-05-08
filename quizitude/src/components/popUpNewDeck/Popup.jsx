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
import fetchLLMResponse from '../../API/LLM';
import CircularWithValueLabel from '../CircularProgressSpinner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Popup = ({ handleClosePopup }) => {
  // State variables
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(1); 
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(''); 
  const [cardTitle, setCardTitle] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [questionType, setQuestionType] = useState('');
  const [pdf, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Add a new state variable [loading]
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
  const handleGenerateFlashcards = async () => {
      let response; // Declare the 'response' variable
      // Check if PDF and number of questions are present
      if (pdf && noOfQuestions && questionType && cardTitle) {
        setLoading(true); // Set loading to true
        // Call fetchLLMResponse function and pass the required parameters
        response = await fetchLLMResponse(noOfQuestions, pdf, questionType);
        let thisResponse = JSON.parse(response);
        setQuestionList(thisResponse); // Set the question list
        setCurrentQuestion(thisResponse[0]); // Set the current question

        setLoading(false); // Set loading to false
        setCurrentPage(1); // Move to the next page
      } else {
        // Handle case where PDF or number of questions is missing
        alert('Please enter all the required details to generate flashcards.');
      }
    };

    const updateCurrentQuestionForward = () => {
      //(using -1 + 1 because the currentFlashcard is 1-indexed and the questionList is 0-indexed)
      setCurrentQuestion(questionList[currentFlashcard-1+1]);
      console.log(currentFlashcard);
      console.log(currentQuestion.question);

    };

    const updateCurrentQuestionBackward = () => {
      //(using -1 - 1 because the currentFlashcard is 1-indexed and the questionList is 0-indexed)
      setCurrentQuestion(questionList[currentFlashcard-1-1]);
    }

    const handleNextFlashcard = () => {
      //move the current flashcard to the next only if the current question is not the last question
      if (currentFlashcard < noOfQuestions) {
        setCurrentFlashcard(currentFlashcard + 1);
        updateCurrentQuestionForward();
      }
    };

    const handlePreviousFlashcard = () => {
      //move the current flashcard to the previous only if the current question is not the first question
      if (currentFlashcard > 1) {
        setCurrentFlashcard(currentFlashcard - 1);
        updateCurrentQuestionBackward();
      }
    };





  
  const pages = [
    <div key = {0} className="page1-content">
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
            accept=".pdf"
            onChange={handlePDFChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="generateButton">
        <Button
          id="generateButton"
          fullWidth
          style={{ backgroundColor: '#303484', color: 'white', minHeight: '40px' }}
          onClick={handleGenerateFlashcards}
        >
          {!loading && 'Generate Flashcards'}
          {loading && <CircularWithValueLabel/>}
        </Button>
      </div>
    </div>,
    <div key = {1} className="page2-content">
      <div className="header">
        <h2>Review Flashcards</h2>
        <p>{noOfQuestions} Cards Generated</p>
      </div>
      <div className="review-container">
        <div className="textfields-container">
          <div className="textfield-wrapper1">
            <p className="top">Question</p>
            <TextField
              id="reviewTextField1"
              multiline
              rows={12} 
              fullWidth
              className="reviewTextField"
              style={{backgroundColor: 'white'}}
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            />
            <p className='bottom'>This will appear on the front of the card</p>
          </div>
          <div className="textfield-wrapper2">
            <p className='top'>Answer</p>
            <TextField
              id="reviewTextField2"
              multiline
              rows={12} 
              fullWidth
              className="reviewTextField"
              style={{backgroundColor: 'white'}}
              value={currentQuestion.answer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
            />
            <p className='bottom'>This will appear on the back of the card</p>
          </div>
        </div>
        <div className="navigation">
          <ArrowBackIcon onClick={handlePreviousFlashcard} />
          <span>{currentFlashcard} of {noOfQuestions}</span>
          <ArrowForwardIcon onClick={handleNextFlashcard} />
        </div>
      </div>
      <Button
        id="saveButton"
        style={{ backgroundColor: '#303484', color: 'white', minHeight: '40px', width: '60%', marginTop: '20px'}}
      >
        Save Flashcards
      </Button>
      <Button
        id="regenerateButton"
        style={{ backgroundColor: '#f6fafd', color: 'black', minHeight: '40px', width: '60%', marginTop: '10px'}}
      >
        Regenerate Flashcards
      </Button>
    </div>
  ]

  return (
    <div className="popup-background">
      <div className="popup">
        <IconButton className="closeButton" onClick={handleClosePopup} size="large">
          <CloseIcon fontSize="large" />
        </IconButton>
        <div className="popup-content">
          {pages[currentPage]}
        </div>
      </div>
    </div>
  );
};

export default Popup;