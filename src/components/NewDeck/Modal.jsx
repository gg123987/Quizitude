import { Modal, Box } from "@mui/material";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from 'prop-types';
import CircularWithValueLabel from "../CircularProgressSpinner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import fetchLLMResponse from "@/api/LLM";
import "./modal.css";

const NewDeck = ({ open, handleClose }) => { 
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(1);
  const [cardTitle, setCardTitle] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [pdf, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const maxPDFSize = 30 * 1024 * 1024; // 30 MB in bytes

  const handleCardTitleChange = (event) => {
    setCardTitle(event.target.value);
  };

  const handleNoOfQuestionsChange = (event) => {
    setNoOfQuestions(event.target.value);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleCategoryTypeChange = (event) => {
    setCategoryType(event.target.value);
  };

  const handlePDFChange = (event) => {
    const uploadedPDF = event.target.files[0];
    if (uploadedPDF) {
      if (uploadedPDF.size <= maxPDFSize) {
        setFile(uploadedPDF);
      } else {
        setFile(null);
        alert("File size exceeds the maximum allowed size (30MB).");
      }
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setFile(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 1) {
      alert("Please drop only one file at a time.");
      return;
    }

    if (droppedFiles.length === 1) {
      const droppedFile = droppedFiles[0];
      if (
        droppedFile.type === "application/pdf" &&
        droppedFile.size <= maxPDFSize
      ) {
        setFile(droppedFile);
      } else {
        setFile(null);
        alert("Please drop a valid PDF file (max. 30MB).");
      }
    }
  };

  const handleGenerateFlashcards = async () => {
        
    if (pdf && noOfQuestions && questionType && cardTitle && categoryType) {
      setLoading(true);
      await fetchLLMResponse(noOfQuestions, pdf, questionType);
      setLoading(false);
      setCurrentPage(1);
    } else {
      alert("Please enter all the required details to generate flashcards.");
    }
  };

  const handleNextFlashcard = () => {
    if (currentFlashcard < noOfQuestions) {
      setCurrentFlashcard(currentFlashcard + 1);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcard > 1) {
      setCurrentFlashcard(currentFlashcard - 1);
    }
  };

  const pages = [
    <div className="page1-content" key="page1">
      <div className="header">
        <h2>Generate Flashcards</h2>
        <p>
          This creates a deck of cards based on any material you upload here.
        </p>
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
      <div className="textfields-container">
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

      <FormControl fullWidth>
        <InputLabel id="typeOfCategory">Category</InputLabel>
        <Select
          id="typeOfCategory"
          value={categoryType}
          label="Type of Category"
          onChange={handleCategoryTypeChange}
          >
          <MenuItem value="maths">Maths</MenuItem>
          <MenuItem value="science">Science</MenuItem>
        </Select>
      </FormControl>
      </div>
      <div
        className={`upload-container ${pdf ? "has-pdf" : ""}`}
        onClick={() => document.getElementById("pdf-upload").click()}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
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
            <strong>{pdf.name}</strong>
            <br />
            {pdf.size > 1024 * 1024
              ? `${(pdf.size / (1024 * 1024)).toFixed(2)} MB`
              : `${Math.round(pdf.size / 1024)} KB`}
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
          style={{ display: "none" }}
        />
      </div>
      <div className="generateButton">
        <Button
          id="generateButton"
          fullWidth
          style={{
            backgroundColor: "#303484",
            color: "white",
            minHeight: "40px",
          }}
          onClick={handleGenerateFlashcards}
        >
          {!loading && "Generate Flashcards"}
          {loading && <CircularWithValueLabel />}
        </Button>
      </div>
    </div>,
    <div className="page2-content" key="page2">
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
              style={{ backgroundColor: "white" }}
            />
            <p className="bottom">This will appear on the front of the card</p>
          </div>
          <div className="textfield-wrapper2">
            <p className="top">Answer</p>
            <TextField
              id="reviewTextField2"
              multiline
              rows={12}
              fullWidth
              className="reviewTextField"
              style={{ backgroundColor: "white" }}
            />
            <p className="bottom">This will appear on the back of the card</p>
          </div>
        </div>
        <div className="navigation">
          <ArrowBackIcon onClick={handlePreviousFlashcard} />
          <span>
            {currentFlashcard} of {noOfQuestions}
          </span>
          <ArrowForwardIcon onClick={handleNextFlashcard} />
        </div>
      </div>
      <Button
        id="saveButton"
        style={{
          backgroundColor: "#303484",
          color: "white",
          minHeight: "40px",
          width: "60%",
          marginTop: "20px",
        }}
      >
        Save Flashcards
      </Button>
      <Button
        id="regenerateButton"
        style={{
          backgroundColor: "#f6fafd",
          color: "black",
          minHeight: "40px",
          width: "60%",
          marginTop: "10px",
        }}
      >
        Regenerate Flashcards
      </Button>
    </div>,
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="popup">
        <div className="close">
          <IconButton
            className="close-button"
            onClick={handleClose}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="popup-content">{pages[currentPage]}</div>
      </Box>
    </Modal>
  );
};

NewDeck.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default NewDeck;
