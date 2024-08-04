import { useState, useEffect } from "react";
import FlashcardList from "../../components/Flashcard/FlashcardList";
import "./studymode.css";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import FlashcardSlider from "../../components/Flashcard/FlashcardSlider";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import CompareIcon from "@mui/icons-material/Compare";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import confetti from "../../assets/confetti.svg";

const StudyMode = () => {
  const [cards, setCards] = useState(SAMPLE_CARDS_LONG); // Array of flashcards
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Index of the current flashcard
  const [flipped, setFlipped] = useState(false); // Boolean to track if the flashcard is flipped
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if all cards have been answered
    const allAnswered = cards.every((card) => card.score !== undefined);
    if (allAnswered) {
      setShowSummary(true);
    }
  }, [cards]);

  useEffect(() => {
    // Set flipped to false when the current card changes
    setFlipped(false);
  }, [currentCardIndex]);  

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

    // if flipped = true now, and no answer was given for option, set answered to -1 and score to incorrect
    if (
      !flipped &&
      cards[currentCardIndex].options.length > 0 &&
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
    setCards(SAMPLE_CARDS_LONG); // Reset cards to initial state
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
    const correctCount = cards.filter(
      (card) => card.score === "correct"
    ).length;
    const incorrectCount = cards.length - correctCount;
    const scorePercentage = (correctCount / cards.length) * 100;

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
          sx={{ mb: 2, fontSize: 22, fontFamily: "Inter", fontWeight: 600 }}
        >
          Congratulations!
        </Typography>
        <Typography
          sx={{ mb: 2, fontSize: 16, fontFamily: "Inter", fontWeight: 400 }}
        >
          You reviewed all your cards. You are making great <br />
          progress. Check out your results!
        </Typography>
        <div className="summary-divider">
          <div className="summary-progress">
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                mt: 2,
                borderRadius: "50%",
              }}
            >
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
    <div className="flashcard-page">
      <div className="flashcard-header">
        <Typography sx={{ fontWeight: "bold" }}>Study Mode</Typography>
        <Typography sx={{ fontWeight: "600", fontSize: "1.2rem" }}>
          Category | {cards.length} cards
        </Typography>
        <Button variant="text" onClick={handleclose}>
          <CloseIcon />
        </Button>
      </div>
      {showSummary ? (
        renderSummary()
      ) : (
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
              {cards[currentCardIndex]?.options.length > 0 ? (
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
                    Don't know this
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

const SAMPLE_CARDS = [
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
];

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
