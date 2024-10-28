import { useState, useEffect } from "react";
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
import useDecks from "@/hooks/useDecks";
import { createCategory } from "@/services/categoryService";
import NewCategory from "@/components/features/NewCategory/NewCatModal";
import {
  uploadFileAndCreateDeck,
  getFileById,
  checkForDuplicateFile,
} from "@/services/fileService";
import { formatAndInsertFlashcardData } from "@/services/flashcardService";
import "./newdeck.css";

/**
 * NewDeck component allows users to create a new deck of flashcards by uploading a PDF file,
 * specifying the number of questions, question type, and category. It also provides functionality
 * to review and edit the generated flashcards before saving them.
 *
 * @component
 * @example
 * return (
 *   <NewDeck />
 * )
 *
 * @returns {JSX.Element} The rendered NewDeck component.
 *
 * @description
 * This component handles the following functionalities:
 * - Fetching and displaying categories.
 * - Handling file uploads and drag-and-drop functionality for PDF files.
 * - Validating user inputs such as deck name, number of questions, question type, and category.
 * - Generating flashcards using an LLM (Language Learning Model) based on the uploaded PDF.
 * - Allowing users to review and edit the generated flashcards.
 * - Saving the deck and flashcards to the server.
 *
 * @state {Object} user - The authenticated user object.
 * @state {Array} categories - List of available categories.
 * @state {boolean} categoriesLoading - Loading state for categories.
 * @state {Object} categoriesError - Error state for categories.
 * @state {boolean} modalOpen - State to control the visibility of the modal.
 * @state {Object} selectedFile - The selected PDF file.
 * @state {Object} file - The uploaded PDF file.
 * @state {number} currentPage - The current page of the modal (0 for generation, 1 for review).
 * @state {number} currentFlashcard - The index of the current flashcard being reviewed.
 * @state {Array} questionList - List of generated questions.
 * @state {Object} currentQuestion - The current question being reviewed.
 * @state {string} noOfQuestions - The number of questions to generate.
 * @state {string} questionType - The type of questions to generate (multiple-choice or short-answer).
 * @state {boolean} newCategoryModalOpen - State to control the visibility of the new category modal.
 * @state {string} deckName - The name of the deck.
 * @state {string} categoryId - The selected category ID.
 * @state {boolean} uploading - State to indicate if the file is being uploaded.
 * @state {Object} llmResponse - The response from the LLM.
 * @state {string} errorp1 - Error message for the first page.
 * @state {string} errorp2 - Error message for the second page.
 *
 * @function handleDeckNameChange - Updates the deck name state.
 * @function handleNoOfQuestionsChange - Updates the number of questions state.
 * @function resetComponent - Resets the component state to initial values.
 * @function handleClose - Closes the modal and resets the component state.
 * @function handleQuestionTypeChange - Updates the question type state.
 * @function handleCategoryChange - Updates the category state or opens the new category modal.
 * @function handleFileChange - Handles file selection and validation.
 * @function handleDelete - Deletes the selected file.
 * @function handleDrop - Handles file drop and validation.
 * @function p1Validations - Validates the inputs on the first page.
 * @function CheckDeckName - Checks if the deck name already exists.
 * @function handleUpload - Uploads the file and creates the deck and flashcards.
 * @function handleGenerateFlashcards - Generates flashcards using the LLM.
 * @function updateCurrentQuestionForward - Updates the current question and moves to the next one.
 * @function updateCurrentQuestionBackward - Updates the current question and moves to the previous one.
 * @function handleNextFlashcard - Moves to the next flashcard.
 * @function handlePreviousFlashcard - Moves to the previous flashcard.
 * @function handleAddNewCategory - Opens the new category modal.
 * @function handleSaveNewCategory - Saves the new category and refreshes the categories list.
 * @function formatFlashcardData - Formats the flashcard data for review.
 */
const NewDeck = () => {
  const { user } = useAuth();
  const { categories, categoriesLoading, categoriesError, refreshCategories } =
    useCategories(user?.id);

  const { modalOpen, closeModal, file: selectedFile } = useModal();
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFlashcard, setCurrentFlashcard] = useState(1);
  const [questionList, setQuestionList] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const maxPDFSize = 30 * 1024 * 1024; // 30 MB in bytes
  const [deckName, setDeckName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [uploading, setUploading] = useState(false);
  //create a variable to store the response from the LLM
  const [llmResponse, setLlmResponse] = useState();
  const [errorp1, setError1] = useState(null);
  const [errorp2, setError2] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      console.log("Selected file:", selectedFile);
      if (selectedFile) {
        try {
          const file = await getFileById(selectedFile.id);

          if (file) {
            console.log("File:", file);
            setFile(file);
          } else {
            console.error("File not found.");
          }
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    };

    fetchFile();
  }, [selectedFile]);

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
    setError1(null);
    setError2(null);
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
    console.log("Uploaded PDF:", uploadedPDF);
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

  const p1Validations = async () => {
    console.log("Validating page 1 inputs");

    setError1(null);

    if (!deckName) {
      setError1("Please enter a deck name.");
      return false;
    }

    if (!noOfQuestions) {
      setError1("Please enter the number of questions.");
      return false;
    }

    if (!questionType) {
      setError1("Please select the type of question.");
      return false;
    }

    if (!file) {
      setError1("Please upload a PDF file.");
      return false;
    }

    // Check for duplicate file
    const isDuplicate = await checkForDuplicateFile(file, user.id);
    console.log("Duplicate file:", isDuplicate);

    if (isDuplicate) {
      setError1("File already exists. Please choose a different file.");
      return false;
    }

    // Check if the deck name already exists
    if (CheckDeckName(deckName)) {
      setError1(
        "A deck with the same name already exists. Please choose a different name."
      );
      return false;
    }

    return true;
  };

  //function to get all the decks of the user
  const { decks } = useDecks(user?.id);

  const CheckDeckName = (deckName) => {
    //check if the deck name exists in the decks
    const deckExists = decks.some((deck) => deck.name === deckName);

    return deckExists;
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError2(null);
      const deckData = {
        name: deckName,
        user_id: user.id,
        category_id: categoryId === "" ? null : categoryId,
      };
      const result = await uploadFileAndCreateDeck(file, deckData);
      console.log("Upload and deck creation successful:", result);

      // Get the deckId
      const deckId = result.deck.id;

      // Format and insert the flashcard data
      await formatAndInsertFlashcardData(llmResponse, deckId);

      console.log("Deck, file, and flashcards created successfully");

      // Close the modal
      handleClose();
    } catch (error) {
      console.error("Error during upload:", error);

      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        setError2(
          "A deck with the same name already exists. Please choose a different name."
        );
      } else {
        setError2(
          "An error occurred while uploading the file. Please try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      const isValid = await p1Validations();

      if (isValid) {
        setError1(null);
        setUploading(true);

        let response = await fetchLLMResponse(
          noOfQuestions,
          file,
          questionType
        );

        //create a copy of the response to avoid modifying the original response
        let thisResponse = JSON.parse(JSON.stringify(response));
        thisResponse = formatFlashcardData(thisResponse);

        setQuestionList(thisResponse);
        setCurrentQuestion(thisResponse[0]);

        setUploading(false);
        setError1(null);
        setError2(null);
        setCurrentPage(1);

        setLlmResponse(response);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setUploading(false);
    }
  };

  const updateCurrentQuestionForward = () => {
    // Fetch the updated values from the DOM
    const updatedQuestion = document.getElementById(
      "reviewTextFieldQuestion"
    ).value;
    const updatedAnswer = document.getElementById(
      "reviewTextFieldAnswer"
    ).value;

    // Update the currentQuestion state with the updated values
    setCurrentQuestion({ question: updatedQuestion, answer: updatedAnswer });
    //console.log(currentQuestion.question);

    // Update questionsList with the amended question
    const updatedQuestionList = [...questionList];
    updatedQuestionList[currentFlashcard - 1] = currentQuestion;
    setQuestionList(updatedQuestionList);

    // Move to the next question
    //(using -1 + 1 because the currentFlashcard is 1-indexed and the questionList is 0-indexed)
    setCurrentQuestion(questionList[currentFlashcard - 1 + 1]);
  };

  const updateCurrentQuestionBackward = () => {
    // Fetch the updated values from the DOM
    const updatedQuestion = document.getElementById(
      "reviewTextFieldQuestion"
    ).value;
    const updatedAnswer = document.getElementById(
      "reviewTextFieldAnswer"
    ).value;

    // Update the currentQuestion state with the updated values
    setCurrentQuestion({ question: updatedQuestion, answer: updatedAnswer });

    // Update questionsList with the amended question
    const updatedQuestionList = [...questionList];
    updatedQuestionList[currentFlashcard - 1] = currentQuestion;
    setQuestionList(updatedQuestionList);

    // Move to the previous question
    //(using -1 - 1 because the currentFlashcard is 1-indexed and the questionList is 0-indexed)
    setCurrentQuestion(questionList[currentFlashcard - 1 - 1]);
  };

  const handleNextFlashcard = () => {
    if (currentFlashcard < noOfQuestions) {
      setCurrentFlashcard(currentFlashcard + 1);
      updateCurrentQuestionForward();
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcard > 1) {
      setCurrentFlashcard(currentFlashcard - 1);
      updateCurrentQuestionBackward();
      //console.log(document.getElementById('reviewTextFieldQuestion').value);
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

  //function to modify the flashcard data to be displayed in the review flashcards page
  //this function takes in the response for the LLM and formats the Multiple Choice questions options
  const formatFlashcardData = (response) => {
    let thisResponse = response;
    //check if the response is for multiple choice questions by checking if it contains the "choices" key
    if (response[0].choices) {
      // Modify each question in the response array
      thisResponse.forEach((question) => {
        // Append a new line to the value of the "question" key
        question.question += "\n";
        question.question += "Options:\n";

        // Initialize a counter for options
        let optionCounter = 65; // ASCII value of 'A'
        // Loop through choices
        question.choices.forEach((choice) => {
          // Append the letter for the option
          question.question += `${String.fromCharCode(
            optionCounter
          )}. ${choice}\n`;
          // Increment the counter for the next letter
          optionCounter++;
        });

        // Delete the "choices" key
        delete question.choices;
      });
    }
    return thisResponse;
  };

  const pages = [
    <div className="page1-content" key="page1">
      <div className="deck-text-header">
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
            data-testid="question-type-select"
          >
            <MenuItem value={"multiple-choice"}>Multiple Choice</MenuItem>
            <MenuItem value={"short-answer"}>Short Answer</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="typeOfCategory-label">Category</InputLabel>
          <Select
            id="typeOfCategory"
            labelId="typeOfCategory-label"
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
                padding: "4px 15px",
                fontSize: "14px",
                color: "dark-grey",
                margin: "10px 10px",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
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
          data-testid="pdf-upload"
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
          {uploading && <CircularWithValueLabel interval={400} />}
        </Button>
      </div>
      {errorp1 && <p className="error-message">{errorp1}</p>}
    </div>,
    <div className="page2-content" key="page2">
      <div className="deck-text-header">
        <h2>Review Flashcards</h2>
        <p>{noOfQuestions} Cards Generated</p>
      </div>
      <div className="review-container">
        <div className="textfields-container">
          <div className="textfield-wrapper1">
            <p className="top">Question</p>
            <div className="question-container">
              <TextField
                id="reviewTextFieldQuestion"
                multiline
                rows={8}
                fullWidth
                className="reviewTextField"
                style={{ backgroundColor: "white" }}
                value={currentQuestion.question}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value,
                  })
                }
              />
            </div>
            <p className="bottom">This will appear on the front of the card</p>
          </div>
          <div className="textfield-wrapper2">
            <p className="top">Answer</p>
            <div className="answer-container">
              <TextField
                id="reviewTextFieldAnswer"
                multiline
                rows={8}
                fullWidth
                className="reviewTextField"
                style={{ backgroundColor: "white" }}
                value={currentQuestion.answer}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    answer: e.target.value,
                  })
                }
              />
            </div>
            <p className="bottom">This will appear on the back of the card</p>
          </div>
        </div>
        <div className="navigation">
          <ArrowBackIcon
            onClick={handlePreviousFlashcard}
            style={{ cursor: "pointer" }}
          />
          <span>
            {currentFlashcard} of {noOfQuestions}
          </span>
          <ArrowForwardIcon
            onClick={handleNextFlashcard}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      {errorp2 && <p className="error-message">{errorp2}</p>}
      {uploading && <CircularWithValueLabel />}
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
            <div className="deck-popup-content">{pages[currentPage]}</div>
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
