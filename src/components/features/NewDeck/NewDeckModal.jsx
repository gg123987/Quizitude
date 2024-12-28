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
import CircularProgressSpinner from "@/components/common/CircularProgressSpinner";
import CircularProgress from "@mui/material/CircularProgress";
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
import { UNCATEGORIZED_CATEGORY } from "@/constants/categories";

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
	const [uploadProgress, setUploadProgress] = useState(0);
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

	// Handle file input changes
	const handleFileChange = (event) => {
		const uploadedFile = event.target.files[0];
		const maxFileSize = 30 * 1024 * 1024; // 30MB

		if (uploadedFile) {
			const fileType = uploadedFile.type;
			const validTypes = [
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			];

			if (!validTypes.includes(fileType)) {
				setFile(null);
				alert("Please upload a PDF or Word document.");
				return;
			}

			if (uploadedFile.size <= maxFileSize) {
				setFile(uploadedFile);
			} else {
				setFile(null);
				alert("File size exceeds the maximum allowed size (30MB).");
			}
		}
	};

	// Handle file deletion
	const handleDelete = (event) => {
		event.stopPropagation();
		setFile(null);
	};

	// Handle file drop event
	const handleDrop = (event) => {
		event.preventDefault();
		const droppedFiles = event.dataTransfer.files;

		if (droppedFiles.length > 1) {
			alert("Please drop only one file at a time.");
			return;
		}

		if (droppedFiles.length === 1) {
			const droppedFile = droppedFiles[0];
			const fileType = droppedFile.type;
			const validTypes = [
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			];

			if (validTypes.includes(fileType) && droppedFile.size <= maxPDFSize) {
				setFile(droppedFile);
			} else {
				setFile(null);
				alert("Please drop a valid PDF or Word document (max. 30MB).");
			}
		}
	};

	// Validate inputs on page 1
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

		// Check if the deck name already exists
		if (CheckDeckName(deckName)) {
			setError1(
				"A deck with the same name already exists. Please choose a different name."
			);
			return false;
		}

		return true;
	};

	// Get all the decks of the user
	const { decks } = useDecks(user?.id);

	// Check if the deck name already exists
	const CheckDeckName = (deckName) => {
		const deckExists = decks.some((deck) => deck.name === deckName);
		return deckExists;
	};

	// Handle file upload and deck creation
	const handleUpload = async () => {
		try {
			setUploading(true);
			setError2(null);

			// Validate that we have all required data
			if (!file) {
				setError2("No file selected");
				return;
			}

			if (!deckName) {
				setError2("Please enter a deck name");
				return;
			}

			// Update the deckData creation in handleUpload
			const deckData = {
				name: deckName,
				user_id: user.id,
				category_id: !categoryId || categoryId === "0" ? null : categoryId,
			};

			console.log("Uploading file:", file);
			console.log("Deck data:", deckData);

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
			// Validate inputs on page 1 (excluding file validation for now)
			if (!deckName || !noOfQuestions || !questionType || !file) {
				setError1("Please fill in all required fields.");
				return;
			}

			// Check for duplicate file
			const existingFile = await checkForDuplicateFile(file, user.id);
			let fileToUse = file;

			if (existingFile && existingFile.length > 0) {
				// Get the actual file content from storage if it exists
				fileToUse = await getFileById(existingFile[0].id);
				if (!fileToUse) {
					setError1("Error retrieving existing file. Please try again.");
					return;
				}
			}

			setError1(null);
			setUploading(true);
			setUploadProgress(0);

			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev < 90) {
						return Math.min(prev + 10, 100);
					}
					return prev;
				});
			}, 250);

			// Make the API call with the fileToUse
			const response = await fetchLLMResponse(
				noOfQuestions,
				fileToUse,
				questionType
			);
			clearInterval(progressInterval);

			// Format the response
			let thisResponse = JSON.parse(JSON.stringify(response));
			thisResponse = formatFlashcardData(thisResponse);

			// Update state with the received response
			setQuestionList(thisResponse);
			setCurrentQuestion(thisResponse[0]);
			setLlmResponse(response);
			setError1(null);
			setError2(null);

			setUploadProgress(100);
			setTimeout(() => {
				setUploading(false);
				setCurrentPage(1);
			}, 500);
		} catch (error) {
			console.error("Error during generation:", error);
			setError1("Error generating flashcards. Please try again.");
		} finally {
			setUploadProgress(100);
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

		// Update questionsList with the amended question
		const updatedQuestionList = [...questionList];
		updatedQuestionList[currentFlashcard - 1] = currentQuestion;
		setQuestionList(updatedQuestionList);

		// Move to the next question
		setCurrentQuestion(questionList[currentFlashcard]);
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
		setCurrentQuestion(questionList[currentFlashcard - 2]);
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

	// Format flashcard data for review
	const formatFlashcardData = (response) => {
		let thisResponse = response;
		// Check if the response is for multiple choice questions
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

	// Pages for the modal
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
						<div className="upload-text">
							PDF or Word documents only (max. 30MB)
						</div>
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
					accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
					{uploading && <CircularProgressSpinner value={uploadProgress} />}
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
			{uploading && <CircularProgress color="inherit" />}
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
