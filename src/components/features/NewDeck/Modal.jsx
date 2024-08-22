import { useState } from "react";
import { Modal, Box } from "@mui/material";
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
import CircularWithValueLabel from "@/components/common/CircularProgressSpinner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import fetchLLMResponse from "@/api/LLM";
import useModal from "@/hooks/useModal";
import useAuth from "@/hooks/useAuth";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import useCategories from "@/hooks/useCategories";
import { createCategory } from "@/services/categoryService";
import NewCategory from "@/components/features/NewCategory/Modal";
import { uploadFileAndCreateDeck } from "@/services/fileService";
import { insertDummyFlashcards } from "@/services/flashcardService";
import "./modal.css";

const NewDeck = () => {
  const { user } = useAuth();
  const { categories, categoriesLoading, categoriesError, refreshCategories } =
    useCategories(user?.id);

  const { modalOpen, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(1);
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const maxPDFSize = 30 * 1024 * 1024; // 30 MB in bytes
  const [file, setFile] = useState(null);
  const [deckName, setDeckName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleDeckNameChange = (e) => setDeckName(e.target.value);

  const handleNoOfQuestionsChange = (event) => {
    if (event.target.value > 0) {
      setNoOfQuestions(event.target.value);
    }
  };

  const resetComponent = () => {
    setDeckName("");
    setNoOfQuestions("");
    setQuestionType("");
    setCategoryId("");
    setFile(null);
    setCurrentPage(0);
  };

  const handleClose = () => {
    resetComponent();
    closeModal();
  };

  const handleQuestionTypeChange = (event) =>
    setQuestionType(event.target.value);

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "add-new-category") {
      handleAddNewCategory();
    } else {
      setCategoryId(selectedValue);
    }
  };

  const handleFileChange = (event) => {
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

  const handleUpload = async () => {
    try {
      setUploading(true);
      const deckData = {
        name: deckName,
        user_id: user.id,
        category_id: categoryId === "" ? null : categoryId,
      };
      const result = await uploadFileAndCreateDeck(file, deckData);
      console.log("Upload and deck creation successful:", result);

      // Get the deckId
      const deckId = result.deck.id;

      // Insert dummy flashcards
      await insertDummyFlashcards(deckId);

      console.log("Deck, file, and flashcards created successfully");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setUploading(false);
    }
  };

  
  const handleGenerateFlashcards = async () => {
    if (file && noOfQuestions && questionType && deckName && categoryId) {
      setUploading(true);

      await fetchLLMResponse(noOfQuestions, file, questionType);
      setUploading(false);
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

  const handleAddNewCategory = async () => {
    setNewCategoryModalOpen(true);
  };

  const handleSaveNewCategory = async (categoryName) => {
    const newCategory = { name: categoryName, user_id: user.id };
    const category = await createCategory(newCategory);
    setNewCategoryModalOpen(false); // Close the modal after saving

    // Refresh the categories
    await refreshCategories();

    // Set the newly created category as the selected category
    setCategoryId(category[0].id);
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
            type="text"
            value={deckName}
            placeholder="Deck Name"
            className="titleOfCard"
            onChange={handleDeckNameChange}
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
            value={categoryId}
            label="Type of Category"
            onChange={handleCategoryChange}
            disabled={categoriesLoading || categoriesError}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <MenuItem
              value="add-new-category"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#ddd",
                left: "70%",
                padding: "4px 15px",
                fontSize: "14px",
                color: "dark-grey",
              }}
              onClick={handleAddNewCategory}
            >
              + Add New Category
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div
        className={`upload-container ${file ? "has-pdf" : ""}`}
        onClick={() => document.getElementById("pdf-upload").click()}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {!file && (
          <>
            <CloudUploadIcon className="upload-icon" />
            <div className="upload-text">Click to upload or drag and drop</div>
            <div className="upload-text">PDF only (max. 30MB)</div>
          </>
        )}
        {file && (
          <div className="pdf-info">
            <strong>{file.name}</strong>
            <br />
            {file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              : `${Math.round(file.size / 1024)} KB`}
            <IconButton className="deleteButton" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          onChange={handleFileChange}
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
          disabled={uploading}
        >
          {!uploading && "Generate Flashcards"}
          {uploading && <CircularWithValueLabel />}
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
        onClick={handleUpload}
        disabled={uploading}
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
    <div className="new-deck">
      <Modal
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Fade in={modalOpen}>
          <Box className="popup">
            <div className="close">
              <IconButton className="close-button" onClick={handleClose}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </div>
            <div className="popup-content">{pages[currentPage]}</div>
          </Box>
        </Fade>
      </Modal>
      <NewCategory
        open={newCategoryModalOpen}
        onClose={() => setNewCategoryModalOpen(false)}
        onSave={handleSaveNewCategory}
      />
    </div>
  );
};

export default NewDeck;
