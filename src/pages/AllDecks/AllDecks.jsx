import React from "react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useDecks from "@/hooks/useDecks";
import CircularWithValueLabel from "@/components/common/CircularProgressSpinner";
import SelectSort from "@/components/common/SelectSort";
import CustomButton from "@/components/common/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import useModal from "@/hooks/useModal";
import NewDeck from "@/components/features/NewDeck/Modal";
import BasicTabs from "@/components/features/DisplayDecks/TabSelect";
import ClearIcon from "@mui/icons-material/Clear";
import FilteredDecks from "@/components/features/DisplayDecks/FilteredDecks";
import { useMediaQuery } from "@mui/material";
import "./alldecks.css";

const CustomTextField = styled(TextField)(() => ({
  width: "280px",
  backgroundColor: "white",
  marginBottom: "20px",
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

const Decks = () => {
  const { userId } = useOutletContext();
  const { decks, loading, error } = useDecks(userId);
  const { openModal } = useModal();
  const [value, setValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Recently Created"); // Default sort option

  const isLargeScreen = useMediaQuery("(min-width: 1630px)");
  const isMediumScreen = useMediaQuery("(min-width: 1247px)");
  const isSmallScreen = useMediaQuery("(min-width: 450px)");

  const columns = isLargeScreen
    ? 4
    : isMediumScreen
    ? 3
    : isSmallScreen
    ? 2
    : 1;
  const rows = 3; // Fixed number of rows per page
  const decksPerPage = rows * columns;

  const filteredDecks = React.useMemo(() => {
    if (searchQuery.trim() === "") {
      return decks;
    }
    return decks.filter((deck) =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);

  const handleTabChange = React.useCallback((event, newValue) => {
    setValue(newValue);
    setCurrentPage(1); // Reset to first page when changing tabs
  }, []);

  const handleOpenModal = () => {
    openModal(<NewDeck />);
  };

  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    setShowClearIcon(searchQuery === "" ? "none" : "flex");
  }, [searchQuery]);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const filteredAndSortedDecks = React.useMemo(() => {
    let sortedDecks = [];
    switch (value) {
      case 1: // Favourites
        sortedDecks = filteredDecks.filter((deck) => deck.is_favourite);
        break;
      case 2: // Reviewed
        sortedDecks = filteredDecks.filter((deck) => deck.is_reviewed);
        break;
      default: // All
        sortedDecks = [...filteredDecks]; // Don't mutate the original array
        break;
    }

    // Apply sorting
    switch (sortOption) {
      case "Recently Created":
        sortedDecks.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "Last Modified":
        sortedDecks.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        break;
      case "Alphabetical":
        sortedDecks.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Oldest":
        sortedDecks.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      default:
        break; // No sorting
    }

    return sortedDecks;
  }, [filteredDecks, value, sortOption]);

  const totalDecks = filteredAndSortedDecks.length;
  const totalPages = Math.ceil(totalDecks / decksPerPage);

  // Slice decks for current page
  const currentDecks = React.useMemo(() => {
    const start = (currentPage - 1) * decksPerPage;
    const end = start + decksPerPage;
    return filteredAndSortedDecks.slice(start, end);
  }, [filteredAndSortedDecks, currentPage, decksPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const tabsData = React.useMemo(
    () => [
      {
        label: "All",
        content: <FilteredDecks filteredAndSortedDecks={currentDecks} />,
      },
      {
        label: "Favourites",
        content: <FilteredDecks filteredAndSortedDecks={currentDecks} />,
      },
      {
        label: "Reviewed",
        content: <FilteredDecks filteredAndSortedDecks={currentDecks} />,
      },
    ],
    [currentDecks]
  );

  return (
    <div className="all-decks">
      <div className="all-decks-header">
        <h1 className="title">All Decks</h1>
        {decks.length > 0 && (
          <div className="count-badge">
            {totalDecks === 1 ? (
            <p className="deck-count">{totalDecks} deck</p>
            ) : (
            <p className="deck-count">{totalDecks} decks</p>
            )}
          </div>
        )}
      </div>
      <div className="all-decks-filter">
        <div className="col-left">
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
          {decks.length > 0 ? (
            <BasicTabs
              tabsData={tabsData}
              value={value}
              onTabChange={handleTabChange}
            />
          ) : null}
        </div>

        <div className="col-right">
          <SelectSort onSortChange={handleSortChange} />
        </div>
      </div>

      <div className="all-decks-data">
        {loading && <CircularWithValueLabel />}
        {error && <p className="error-message">{error.message}</p>}
        {!loading && !error && decks.length === 0 && (
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
            <h2>You have no flashcards yet</h2>
            <p>Upload your first PDF to get started. Click the button below</p>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CustomButton onClick={handleOpenModal} icon={<AddIcon />}>
                {"New Deck"}
              </CustomButton>
            </Box>
          </Box>
        )}
        {tabsData[value].content}
      </div>
      {totalPages > 1 && (
        <div className="footer">
          <div className="pagination-controls">
            <CustomButton
              className="pagination-button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={{
                color: "#344054",
                backgroundColor: "#FFFFFF",
                width: "100px",
                borderColor: "",
                border: "1px solid #D0D5DD",
              }}
            >
              Previous
            </CustomButton>
            <span className="pagination-text">
              Page {currentPage} of {totalPages}
            </span>
            <CustomButton
              className="pagination-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                color: "#344054",
                backgroundColor: "#FFFFFF",
                width: "100px",
                borderColor: "",
                border: "1px solid #D0D5DD",
              }}
            >
              Next
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decks;
