import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import SelectSort from "@/components/common/SelectSort";
import SearchIcon from "@mui/icons-material/Search";
import useDeck from "@/hooks/useDeck";
import useFlashcards from "@/hooks/useFlashcards";
import CircularProgress from "@mui/material/CircularProgress";
import CustomButton from "@/components/common/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import useModal from "@/hooks/useModal";
import { useDeckSessions } from "@/hooks/useSessions";
import NewDeck from "@/components/features/NewDeck/NewDeckModal";
import BasicTabs from "@/components/common/TabSelect";
import ClearIcon from "@mui/icons-material/Clear";
import FlashcardEditList from "@/components/features/Flashcard/FlashcardEditList";
import SessionsTable from "@/components/features/Scores/SessionsTable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { updateDeck, deleteDeck } from "@/services/deckService";
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

/**
 * DeckDetail page displays the details of a specific deck, including its flashcards and sessions.
 * It allows users to search, sort, rename, and delete the deck, as well as navigate to study mode.
 *
 * @component
 * @example
 * return (
 *   <DeckDetail />
 * )
 *
 * @description
 * This page fetches and displays the details of a deck based on the deck ID from the URL parameters.
 * It provides functionalities to:
 * - View and search flashcards within the deck.
 * - Sort and view sessions related to the deck.
 * - Rename and delete the deck.
 * - Navigate to the study mode with the filtered flashcards.
 *
 * @requires useParams - To get the deck ID from the URL.
 * @requires useDeck - Custom hook to fetch deck details.
 * @requires useDeckSessions - Custom hook to fetch deck sessions.
 * @requires useFlashcards - Custom hook to fetch flashcards.
 * @requires useModal - Custom hook to handle modal operations.
 * @requires useNavigate - To navigate between routes.
 *
 */
const DeckDetail = () => {
  const { id } = useParams();
  const { deck, loading, error, refreshDeck } = useDeck(id);
  const { sessions } = useDeckSessions(id);
  const [sortedSessions, setSortedSessions] = useState(sessions);
  const { flashcards, refresh: refreshFlashcards } = useFlashcards(id);
  const [filteredFlashcards, setFilteredFlashcards] = useState(flashcards);
  const { openModal } = useModal();
  const [value, setValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [renameError, setRenameError] = useState(null);
  const navigate = useNavigate();

  // States for renaming and deleting
  const [anchorEl, setAnchorEl] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");

  const menuOpen = Boolean(anchorEl);

  // Update sortedSessions when sessions change
  React.useEffect(() => {
    setSortedSessions(sessions);
  }, [sessions]);

  // Update filteredFlashcards when flashcards change
  React.useEffect(() => {
    // If searchQuery is empty, set filteredFlashcards to flashcards
    if (searchQuery === "") {
      setFilteredFlashcards(flashcards);
    } else {
      // Filter flashcards based on searchQuery
      const filtered = flashcards.filter((flashcard) =>
        flashcard.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFlashcards(filtered);
    }
  }, [flashcards, searchQuery]);

  const handleTabChange = React.useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleOpenModal = () => {
    openModal(<NewDeck />);
  };

  // Handle search input change
  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchQuery(event.target.value);
  };

  // navigate to study mode with filtered flashcards
  const handleStudyCard = () => {
    console.log("Study Card");
    navigate("/study", {
      state: {
        flashcards: filteredFlashcards,
        deckName: deck.name,
        deckId: deck.id,
      },
    });
  };

  const handleSortChange = (option) => {
    const sorted = [...sessions].sort((a, b) => {
      if (option === "Today") {
        return new Date(b.date_reviewed) - new Date(a.date_reviewed);
      } else if (option === "Oldest") {
        return new Date(a.date_reviewed) - new Date(b.date_reviewed);
      }
      return 0;
    });

    setSortedSessions(sorted); // Update sortedSessions with sorted data
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setShowClearIcon("none");
  };

  // Dropdown menu handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameDeck = () => {
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDeck = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameDialogClose = () => {
    setNewDeckName("");
    setRenameDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleRenameSubmit = async () => {
    try {
      const updatedDeck = await updateDeck(
        deck.id,
        { name: newDeckName },
        deck.user_id
      );

      // If the deck was updated successfully, close the dialog
      if (updatedDeck) {
        handleRenameDialogClose();
        refreshDeck();
      }
    } catch (error) {
      if (error.message.includes("duplicate key value")) {
        setRenameError("Deck name must be unique");
      } else {
        setRenameError("An error occurred. Please try again.");
      }
    }
  };

  const handleDeleteSubmit = async () => {
    console.log("Deleting deck...");
    await deleteDeck(deck.id);
    navigate("/decks");
  };

  const tabsData = React.useMemo(
    () => [
      {
        label: "Cards",
        content: (
          <div className="flashcard-edit-list">
            <FlashcardEditList
              flashcards={filteredFlashcards}
              refreshFlashcards={refreshFlashcards}
            />
          </div>
        ),
      },
      {
        label: "View Scores",
        content: (
          <div className="deck-table">
            <SessionsTable sessions={sortedSessions} />
          </div>
        ),
      },
    ],
    [flashcards, filteredFlashcards, refreshFlashcards, sortedSessions]
  );

  return (
    <div className="decks" style={{ paddingBottom: value === 0 ? "0" : "" }}>
      <div className="decks-container">
        <div className="decks-header">
          <div className="deck-info">
            <div className="deck-titles">
              <h1 className="title">{deck.name}</h1>
              {deck.categories && (
                <div className="count-badge">
                  <p className="deck-count">{deck.categories.name}</p>
                </div>
              )}
            </div>
            <p className="deck-count">{flashcards.length} cards generated</p>
          </div>
          <div className="deck-actions">
            <CustomButton onClick={handleStudyCard} icon={null}>
              {"Study Deck"}
            </CustomButton>
            <CustomButton
              onClick={handleMenuClick}
              icon={<MoreVertIcon />}
              style={{
                color: "#1D2939",
                backgroundColor: "rgba(255, 255, 255, 1)",
                border: "1px solid rgba(208, 213, 221, 1)",
              }}
            >
              {""}
            </CustomButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem onClick={handleRenameDeck}>Rename</MenuItem>
              <MenuItem onClick={handleDeleteDeck}>Delete</MenuItem>
            </Menu>
          </div>
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
            {value === 0 ? (
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
                      onClick={handleSearchClear}
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
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <ClearIcon />
                      </div>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <SelectSort
                onSortChange={handleSortChange}
                sortOptions={[
                  { value: "Today", label: "Today" },
                  { value: "Oldest", label: "Oldest" },
                ]}
                width={"12ch"}
              />
            )}
          </div>
        </div>

        <div className="deck-data content">
          {loading && <CircularProgress color="inherit" />}
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
                  New Deck
                </CustomButton>
              </Box>
            </Box>
          )}
          {tabsData[value].content}
        </div>
      </div>

      {/* Rename Deck Dialog */}
      <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
        <DialogTitle>Rename Deck</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Deck Name"
            fullWidth
            value={newDeckName || deck.name}
            onChange={(e) => setNewDeckName(e.target.value)}
          />
          {renameError && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>{renameError}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose}>Cancel</Button>
          <Button onClick={handleRenameSubmit}>Rename</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Deck Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this deck? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeckDetail;
