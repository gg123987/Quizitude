import { useParams } from "react-router-dom";
import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useDeck from "@/hooks/useDeck";
import useFlashcards from "@/hooks/useFlashcards";
import CircularWithValueLabel from "@/components/common/CircularProgressSpinner";
import CustomButton from "@/components/common/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import useModal from "@/hooks/useModal";
import NewDeck from "@/components/features/NewDeck/NewDeckModal";
import BasicTabs from "@/components/features/DisplayDecks/TabSelect";
import ClearIcon from "@mui/icons-material/Clear";
import FlashcardEditList from "@/components/features/Flashcard/FlashcardEditList";
import DeckTable from "@/components/features/Scores/DeckTable";
import "./singledeck.css";

const CustomTextField = styled(TextField)(() => ({
  width: "280px",
  backgroundColor: "white",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D0D5DD",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3538CD",
    },
  },
}));

const DeckDetail = () => {
  const { id } = useParams();
  const { deck, loading, error } = useDeck(id);
  const { flashcards } = useFlashcards(id);
  const { openModal } = useModal();
  const [value, setValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");

  const handleTabChange = React.useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleOpenModal = () => {
    openModal(<NewDeck />);
  };

  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchQuery(event.target.value);
  };

  const tabsData = React.useMemo(
    () => [
      {
        label: "Cards",
        content: (
          <div className="flashcard-edit-list">
            <FlashcardEditList flashcards={flashcards} />
          </div>
        ),
      },
      {
        label: "View Scores",
        content: (
          <div className="deck-table">
            <DeckTable />
          </div>
        ),
      },
    ],
    [flashcards]
  );

  return (
    <div className="decks" style={{ paddingBottom: value === 0 ? "0" : "" }}>
      <div className="decks-container">
        <div className="decks-header">
          <h1 className="title">{deck.name}</h1>
          {deck.categories && (
            <div className="count-badge">
              <p className="deck-count">{deck.categories.name}</p>
            </div>
          )}
          <p className="deck-count">{flashcards.length} cards</p>
        </div>
        <div className="decks-filter">
          <div className="col-left">
            {flashcards.length > 0 ? (
              <BasicTabs
                tabsData={tabsData}
                value={value}
                onTabChange={handleTabChange}
              />
            ) : null}
          </div>

          <div className="col-right">
            <CustomTextField
              id="outlined-basic"
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    style={{ display: showClearIcon }}
                    onClick={() => setSearchQuery("")}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "50%",
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => setSearchQuery("")}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <ClearIcon />
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <div className="deck-data content">
          {loading && <CircularWithValueLabel />}
          {error && <p className="error-message">{error.message}</p>}
          {!loading && !error && flashcards.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div>Deck Details for ID: {id}</div>
              <h2>You have no flashcards yet</h2>
              <p>
                Upload your first PDF to get started. Click the button below
              </p>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <CustomButton onClick={handleOpenModal} icon={<AddIcon />}>
                  {"New Deck"}
                </CustomButton>
              </Box>
            </Box>
          )}
          {tabsData[value].content}
        </div>
      </div>
    </div>
  );
};

export default DeckDetail;
