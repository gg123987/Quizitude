import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FlashcardList from "@/components/features/Flashcard/FlashcardList";
import "./studymode.css";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import FlashcardSlider from "@/components/features/Flashcard/FlashcardSlider";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import CompareIcon from "@mui/icons-material/Compare";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { createSession } from "@/services/sessionService";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import confetti from "@/assets/confetti.svg";

/**
 * StudyMode page handles the study session for flashcards.
 * It manages the state of flashcards, user responses, and session logging.
 *
 * @description
 * This page fetches flashcards from the location state and initializes the study session.
 * It provides functionalities to shuffle cards, handle user responses, reveal answers, and log the session.
 * The component also displays a summary screen after all cards have been reviewed.
 *
 * @function
 * @name StudyMode
 *
 * @property {Object} user - The authenticated user object from useAuth.
 * @property {Array} cards - The array of flashcards to be reviewed.
 * @property {boolean} loading - The loading state for fetching flashcards.
 * @property {number} currentCardIndex - The index of the current flashcard being reviewed.
 * @property {boolean} flipped - Boolean to track if the flashcard is flipped.
 * @property {boolean} showSummary - Boolean to track if the summary screen should be displayed.
 * @property {string} deckName - The name of the flashcard deck.
 * @property {string} deckId - The ID of the flashcard deck.
 * @property {number} correctCount - The count of correctly answered flashcards.
 * @property {number} incorrectCount - The count of incorrectly answered flashcards.
 * @property {number} scorePercentage - The percentage score of the review session.
 *
 * @method
 * @name logSession
 * @description Logs the study session data to the backend.
 *
 * @method
 * @name handleShuffle
 * @description Shuffles the order of the flashcards.
 *
 * @method
 * @name handleResponse
 * @description Handles the user's response to a flashcard.
 *
 * @method
 * @name handleReveal
 * @description Toggles the flipped state of the current flashcard.
 *
 * @method
 * @name handleKnow
 * @description Marks the current flashcard as known.
 *
 * @method
 * @name handleDontKnow
 * @description Marks the current flashcard as not known.
 *
 * @method
 * @name handleReviewAgain
 * @description Resets the study session for another review.
 *
 * @method
 * @name handleFinishLesson
 * @description Finishes the lesson and navigates back to the previous page.
 *
 * @method
 * @name handleclose
 * @description Closes the study session and navigates back to the previous page.
 *
 * @method
 * @name AutoNextCard
 * @description Automatically moves to the next flashcard after a delay.
 *
 * @method
 * @name goToNextCard
 * @description Moves to the next flashcard.
 *
 * @method
 * @name goToPreviousCard
 * @description Moves to the previous flashcard.
 *
 * @method
 * @name renderSummary
 * @description Renders the summary screen after all flashcards have been reviewed.
 */

const StudyMode = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Index of the current flashcard
  const [flipped, setFlipped] = useState(false); // Boolean to track if the flashcard is flipped
  const [showSummary, setShowSummary] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [deckId, setDeckId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);

  useEffect(() => {
    // Get flashcards from location state
    const { flashcards, deckName, deckId } = location.state || {};

    // If flashcards are available, set the state
    // Add in score and answered properties to each card
    if (flashcards && deckName && deckId) {
      const flashcardsWithScore = flashcards.map((card) => ({
        ...card,
        score: undefined,
        answered: undefined,
      }));
      setCards(flashcardsWithScore);
      setDeckName(deckName);
      setDeckId(deckId);
      setLoading(false);
    } else {
      // loading state
      setLoading(true);
    }
  }, [location.state]);

  // Log the session when all cards have been answered
  useEffect(() => {
    if (loading) {
      return;
    }
    // Check if all cards have been answered
    const allAnswered = cards.every((card) => card.score !== undefined);
    if (allAnswered) {
      logSession();
    }
  }, [cards]);

  useEffect(() => {
    // Set flipped to false when the current card changes
    setFlipped(false);
  }, [currentCardIndex]);

  const logSession = async () => {
    // Log session into supabase using sessionService
    console.log("All cards have been answered");

    const correctCount = cards.filter(
      (card) => card.score === "correct"
    ).length;
    const incorrectCount = cards.length - correctCount;
    const scorePercentage = (correctCount / cards.length) * 100;

    setCorrectCount(correctCount);
    setIncorrectCount(incorrectCount);
    setScorePercentage(scorePercentage);

    const sessionData = {
      deck_id: deckId,
      deck_name: deckName,
      date_reviewed: new Date().toISOString(),
      correct: correctCount,
      incorrect: incorrectCount,
      score: scorePercentage,
      user_id: user.id,
    };

    const result = await createSession(sessionData);
    console.log("Session created:", result);

    // Show the summary screen
    setShowSummary(true);
  };

  const handleShuffle = () => {
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }
    setCards(shuffledCards);
  };

  const handleResponse = (responseIndex, flashcard) => {
    // Logic to handle the user's response (e.g., mark as reviewed, move to next card)
    console.log(`User responded with option ${responseIndex}`);

    const isCorrect = flashcard.options[responseIndex] === flashcard.answer;
    console.log(`User's response is ${isCorrect ? "correct" : "incorrect"}`);

    // Update the score and answered index of the current flashcard

    const score = isCorrect ? "correct" : "incorrect";
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        score: score,
        answered: responseIndex,
      };
      return updatedCards;
    });

    console.log("Answered card index is", currentCardIndex);

    AutoNextCard();
  };

  const handleReveal = () => {
    // Set flipped value to true for flashcard
    console.log("Flipped:", flipped);

    setFlipped((prevFlipped) => !prevFlipped);

    console.log("Flipped:", !flipped);

    console.log("Answered card index is", cards[currentCardIndex]);
    // if flipped = true now, and no answer was given for option, set answered to -1 and score to incorrect
    if (
      !flipped &&
      cards[currentCardIndex].options != null &&
      cards[currentCardIndex].options?.length > 0 &&
      cards[currentCardIndex].answered === undefined
    ) {
      setCards((prevCards) => {
        const updatedCards = [...prevCards];
        updatedCards[currentCardIndex] = {
          ...updatedCards[currentCardIndex],
          score: "incorrect",
          answered: -1,
        };
        return updatedCards;
      });

      setFlipped((prevFlipped) => !prevFlipped);

      AutoNextCard();
    }
  };

  const handleKnow = () => {
    // Logic to handle "I knew this" response
    console.log("User knew this");

    // Update the score and answered index of the current flashcard
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        score: "correct",
        answered: 0,
      };
      return updatedCards;
    });

    AutoNextCard();
  };

  // Function to handle "I don't know this" button click
  const handleDontKnow = () => {
    // Logic to handle "I don't know this" response
    console.log("User didn't know this");

    // Update the score and answered index of the current flashcard
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        score: "incorrect",
        answered: 1,
      };
      return updatedCards;
    });

    AutoNextCard();
  };

  const handleReviewAgain = () => {
    // Logic to reset the study session
    setShowSummary(false);
    setCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        score: undefined,
        answered: undefined,
      }))
    );
    setCurrentCardIndex(0); // Reset current card index
  };

  const handleFinishLesson = () => {
    // Logic to finish the lesson
    // For example, navigate to a different page or show a completion message
    console.log("Lesson finished!");
    navigate(-1); // Navigate back to the previous page
  };

  const handleclose = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  const AutoNextCard = () => {
    const currentCard = cards[currentCardIndex];

    // Automatically move to the next card after a delay
    setTimeout(() => {
      if (currentCard === cards[currentCardIndex]) {
        goToNextCard();
      }
    }, 1000);
  };

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) =>
      Math.min(prevIndex + 1, cards.length - 1)
    );
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const renderSummary = () => {
    return (
      <div className="summary-container">
        <Box sx={{ mt: "100px", mb: "30px" }}>
          <img
            src={confetti}
            alt="confetti"
            className="confetti"
            width={"80px"}
          />
        </Box>
        <Typography
          sx={{
            mb: 2,
            fontSize: 22,
            fontFamily: "Inter",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Congratulations!
        </Typography>
        <Typography
          sx={{
            mb: 2,
            fontSize: 16,
            fontFamily: "Inter",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          You reviewed all your cards. You are making great <br />
          progress. Check out your results!
        </Typography>
        <div className="summary-divider">
          <div className="summary-progress">
            <Box
              sx={{
                position: "relative", // Allows us to layer elements inside the Box
                display: "inline-flex", // Ensures content inside the Box aligns properly
              }}
            >
              <Box
                sx={{
                  position: "absolute", // Positioned behind the CircularProgress
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="100" height="100" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="rgba(234, 236, 240, 1)"
                    strokeWidth="3"
                  />
                </svg>
              </Box>
              <CircularProgress
                variant="determinate"
                value={scorePercentage}
                size={80}
                sx={{
                  color: "#3538CD", // Change the color of the progress bar based on the score
                  borderRadius: "50%", // Make the circular progress bar rounded
                  "& .MuiCircularProgress-svg": {
                    // Ensure that the SVG contained within CircularProgress is also rounded
                    borderRadius: "50%",
                    overflow: "hidden", // Hide any overflow that may occur due to rounding
                  },
                  "& .MuiCircularProgress-circle": {
                    // Adjust the size of the circle to avoid cutoff when rounded
                    strokeLinecap: "round", // Make the ends of the progress bar rounded
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  fontWeight={600}
                  fontSize={14}
                >
                  {`${Math.round(scorePercentage)}%`}
                </Typography>
              </Box>
            </Box>
          </div>
          <div className="summary-score">
            <div className="summary-score-value">
              <Typography
                sx={{
                  fontFamily: "Inter",
                  color: "green",
                  fontSize: 15,
                  fontWeight: "500",
                  paddingRight: "10px",
                }}
              >
                {correctCount}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  color: "red",
                  fontSize: 15,
                  fontWeight: "500",
                  paddingRight: "10px",
                }}
              >
                {incorrectCount}
              </Typography>
            </div>
            <div className="summary-score-text">
              <Typography
                sx={{ fontFamily: "Inter", fontSize: 13, fontWeight: "500" }}
              >
                Cards Correct
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter", fontSize: 13, fontWeight: "500" }}
              >
                Cards Incorrect
              </Typography>
            </div>
          </div>
        </div>
        <div className="summary-buttons">
          <Button
            onClick={handleReviewAgain}
            variant="contained"
            sx={{
              textTransform: "none",
              color: "white",
              backgroundColor: "#3538CD",
            }}
          >
            Review Again
          </Button>
          <Button
            onClick={handleFinishLesson}
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "#3538CD",
              backgroundColor: "white",
            }}
          >
            Finish Lesson
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="study-page">
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="flashcard-header">
          <Typography sx={{ fontWeight: "bold" }}>Study Mode</Typography>
          <Typography sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
            {deckName} | {cards.length} cards
          </Typography>
          <Button variant="text" onClick={handleclose}>
            <CloseIcon sx={{ color: "black" }} />
          </Button>
        </div>
      )}
      {!loading && showSummary && renderSummary()}
      {!loading && !showSummary && (
        <>
          <div className="flashcard-container">
            <AppBar
              position="relative"
              sx={{
                width: "100%",
                height: "50px",
                boxShadow: "none",
                borderBottom: "none",
                backgroundColor: "transparent",
              }}
            >
              <div className="flashcard-buttons">
                <Toolbar
                  className="toolbar-left"
                  sx={{
                    width: "50%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: "0px",
                    spaceBetween: "3px",
                  }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="shuffle cards"
                    edge="start"
                    onClick={handleShuffle}
                    sx={{ mr: 0, color: "grey" }}
                  >
                    <ShuffleIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    aria-label="shuffle cards"
                    edge="start"
                    onClick={handleReveal}
                    sx={{ mr: 0, color: "grey" }}
                  >
                    <CompareIcon />
                  </IconButton>
                </Toolbar>
                <Toolbar
                  className="toolbar-right"
                  sx={{
                    width: "50%",
                    height: "50px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "0px",
                    spaceBetween: "3px",
                  }}
                >
                  <Typography
                    sx={{ color: "grey", fontWeight: "600", fontSize: "1rem" }}
                  >
                    {currentCardIndex + 1} of {cards.length}
                  </Typography>
                </Toolbar>
              </div>
            </AppBar>
            <div className="flashcard-navigate">
              <div className="flashcard-left">
                <Button
                  onClick={goToPreviousCard}
                  disabled={currentCardIndex === 0}
                >
                  <KeyboardArrowLeftIcon fontSize="large" />
                </Button>
              </div>
              {cards.length > 0 && (
                <FlashcardList
                  flashcards={[cards[currentCardIndex]]}
                  flipped={flipped}
                />
              )}
              <div className="flashcard-right">
                <Button
                  onClick={goToNextCard}
                  disabled={currentCardIndex === cards.length - 1}
                >
                  <KeyboardArrowRightIcon fontSize="large" />
                </Button>
              </div>
            </div>
            {/* Response buttons */}
            <div className="response-buttons">
              {/* Conditionally render multiple-choice options or "I knew this" and "I don't know this" buttons */}
              {cards[currentCardIndex]?.options?.length > 0 ? (
                // Render multiple-choice options
                cards[currentCardIndex]?.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      cards[currentCardIndex].score !== undefined &&
                      option === cards[currentCardIndex].answer
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() =>
                      handleResponse(index, cards[currentCardIndex])
                    }
                    disabled={cards[currentCardIndex].score !== undefined}
                    sx={{
                      textTransform: "none",
                      marginBottom: "15px",
                      "&.Mui-disabled": {
                        backgroundColor:
                          cards[currentCardIndex].score !== undefined &&
                          option === cards[currentCardIndex].answer
                            ? "green"
                            : "inherit",
                        opacity: 0.8, // Override the default opacity for disabled state
                        color:
                          cards[currentCardIndex].score !== undefined &&
                          option === cards[currentCardIndex].answer
                            ? "white"
                            : "",
                        borderColor:
                          cards[currentCardIndex].answered === index &&
                          cards[currentCardIndex].score === "incorrect"
                            ? "red"
                            : "inherit",
                      },
                    }}
                    className="response-button"
                  >
                    {option}
                  </Button>
                ))
              ) : (
                // Render "I knew this" and "I don't know this" buttons
                <>
                  <Button
                    onClick={handleKnow}
                    variant={
                      cards[currentCardIndex].score !== undefined &&
                      cards[currentCardIndex].answered === 0
                        ? "contained"
                        : "outlined"
                    }
                    disabled={cards[currentCardIndex].score !== undefined}
                    sx={{
                      marginRight: "30px",
                      textTransform: "none",
                      marginBottom: "15px",
                      "&.Mui-disabled": {
                        backgroundColor:
                          cards[currentCardIndex].score !== undefined &&
                          cards[currentCardIndex].answered === 0
                            ? "green"
                            : "inherit",
                        opacity: 0.8,
                        color:
                          cards[currentCardIndex].score !== undefined &&
                          cards[currentCardIndex].answered === 0
                            ? "white"
                            : "",
                      },
                    }}
                  >
                    I knew this
                  </Button>
                  <Button
                    onClick={handleDontKnow}
                    variant="outlined"
                    disabled={cards[currentCardIndex].score !== undefined}
                    sx={{
                      marginRight: "30px",
                      textTransform: "none",
                      marginBottom: "15px",
                      "&.Mui-disabled": {
                        borderColor:
                          cards[currentCardIndex].answered === 1 &&
                          cards[currentCardIndex].score === "incorrect"
                            ? "red"
                            : "inherit",
                        opacity: 0.8,
                      },
                    }}
                  >
                    Didn't know this
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="scrollable-container">
              <div className="flashcard-slider-container">
                {/* FlashcardSlider component */}
                <FlashcardSlider
                  flashcards={cards}
                  currentCardIndex={currentCardIndex}
                  reviewedCards={[]}
                  onCardClick={(index) => setCurrentCardIndex(index)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SAMPLE_CARDS_LONG = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    options: [],
    score: undefined,
    answered: undefined,
  },
  {
    id: 2,
    question: "What is the capital of Spain?",
    answer: "Madrid",
    options: ["Paris", "London", "Berlin", "Madrid"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 3,
    question: "What is the capital of Italy?",
    answer: "Rome",
    options: ["Paris", "Rome", "Berlin", "Madrid"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 4,
    question: "What is the capital of Germany?",
    answer: "Berlin",
    options: ["Paris", "London", "Berlin", "Madrid"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 5,
    question: "What is the capital of the United Kingdom?",
    answer: "London",
    options: ["Paris", "London", "Berlin", "Madrid"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 6,
    question: "What is the capital of the United States?",
    answer: "Washington, D.C.",
    options: [],
    score: undefined,
    answered: undefined,
  },
  {
    id: 7,
    question: "What is the capital of Japan?",
    answer: "Tokyo",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 8,
    question: "What is the capital of Brazil?",
    answer: "Brasília",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Buenos Aires"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 9,
    question: "What is the capital of India?",
    answer: "New Delhi",
    options: ["Mumbai", "New Delhi", "Bangalore", "Chennai"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 10,
    question: "What is the capital of Australia?",
    answer: "Canberra",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 11,
    question: "What is the capital of South Africa?",
    answer: "Pretoria",
    options: ["Cape Town", "Johannesburg", "Pretoria", "Durban"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 12,
    question: "What is the capital of Russia?",
    answer: "Moscow",
    options: ["St. Petersburg", "Moscow", "Kazan", "Vladivostok"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 13,
    question: "What is the capital of China?",
    answer: "Beijing",
    options: ["Shanghai", "Guangzhou", "Beijing", "Shenzhen"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 14,
    question: "What is the capital of Canada?",
    answer: "Ottawa",
    options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    score: undefined,
    answered: undefined,
  },
  {
    id: 15,
    question: "What is the capital of Mexico?",
    answer: "Mexico City",
    options: ["Guadalajara", "Monterrey", "Mexico City", "Puebla"],
    score: undefined,
    answered: undefined,
  },
];

export default StudyMode;
