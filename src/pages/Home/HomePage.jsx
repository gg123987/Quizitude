import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilteredDecks from "@/components/features/DisplayDecks/FilteredDecks";
import FilteredCategories from "@/components/features/DisplayCategories/FilteredCategories";
import useDecks from "@/hooks/useDecks";
import useCategories from "@/hooks/useCategories";
import useAuth from "@/hooks/useAuth";
import useStreak from "@/hooks/useStreak";
import { useMediaQuery } from "@mui/material";
import flame from "@/assets/flame.png";
import WeekIndicator from "@/components/features/Streaks/WeekIndicator";
import CircularProgress from "@mui/material/CircularProgress";
import "./home.css"; // Add your CSS styles here

/**
 * Home component - Main page for displaying user-specific content such as recent decks, pinned decks, and categories.
 */
const Home = () => {
  const { userId } = useOutletContext(); // Get user ID from context
  const { user, userDetails } = useAuth();
  const { decks, loading: decksLoading, error } = useDecks(userId); // Fetch decks
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(userId); // Fetch categories

  const [loading, setLoading] = useState(true); // State to manage loading spinner
  const streakCount = useStreak(userId); // Fetch user's streak count

  useEffect(() => {
    // If loading decks or categories, show loading spinner
    if (decksLoading || categoriesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [decksLoading, categoriesLoading]);

  const [currentRecentIndex, setCurrentRecentIndex] = useState(0); // State for recent decks pagination
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0); // State for pinned decks pagination

  // Media queries to determine screen size
  const isLargeScreen = useMediaQuery("(min-width: 1630px)");
  const isMediumScreen = useMediaQuery("(min-width: 1247px)");
  const isSmallScreen = useMediaQuery("(min-width: 450px)");

  // Determine number of decks per row based on screen size
  const decksPerRow = isLargeScreen
    ? 4
    : isMediumScreen
    ? 3
    : isSmallScreen
    ? 2
    : 1;

  // Determine number of categories per row based on screen size
  const categoriesPerRow = isLargeScreen
    ? 4
    : isMediumScreen
    ? 3
    : isSmallScreen
    ? 2
    : 1;

  const rowsToShow = 3; // Number of rows to show for categories
  const categoriesLimit = categoriesPerRow * rowsToShow; // Limit for categories to display

  // Filter and sort recent decks
  const recentDecks = React.useMemo(() => {
    return decks
      .filter((deck) => !deck.is_pinned) // Only recent decks that are not pinned
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // Sort by updated_at
      .slice(0, decksPerRow); // Take only the most recent decks based on decksPerRow
  }, [decks]);

  // Limit the displayed categories
  const displayedCategories = React.useMemo(() => {
    return categories.slice(0, categoriesLimit);
  }, [categories]);

  // Filter pinned decks
  const pinnedDecks = React.useMemo(() => {
    return decks.filter((deck) => deck.is_pinned); // Only pinned decks
  }, [decks]);

  // Handle pagination for pinned decks
  const handleNextPinned = () => {
    if (currentPinnedIndex < Math.ceil(pinnedDecks.length / decksPerRow) - 1) {
      setCurrentPinnedIndex(currentPinnedIndex + 1);
    }
  };

  const handlePreviousPinned = () => {
    if (currentPinnedIndex > 0) {
      setCurrentPinnedIndex(currentPinnedIndex - 1);
    }
  };

  // Check if the user has studied today
  const checkStudyToday = () => {
    const today = new Date();
    const lastSession = userDetails.last_session
      ? new Date(userDetails.last_session)
      : null;
    if (lastSession) {
      const lastSessionDate = new Date(
        lastSession.getFullYear(),
        lastSession.getMonth(),
        lastSession.getDate()
      );
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      return lastSessionDate.getTime() === todayDate.getTime();
    }
    return false;
  };

  // Get the displayed pinned decks based on pagination
  const displayedPinnedDecks = pinnedDecks.slice(
    currentPinnedIndex * decksPerRow,
    (currentPinnedIndex + 1) * decksPerRow
  );

  const userFirstName =
    userDetails && userDetails.full_name
      ? userDetails.full_name.split(" ")[0]
      : "User";

  return (
    <div className="home">
      <h1 className="title">Welcome back, {userFirstName}</h1>
      <p className="subtitle">Keep going, you are making progress</p>

      <section className="streak-section">
        <div className="streak-box">
          <div className="streak-col left">
            <div className="streak-graphic">
              <img src={flame} alt="Streak" />
              <div className="streak-count-group">
                <h4 className="streak-count">{streakCount}</h4>
                <h2 className="streak-day">Day Streak</h2>
              </div>
            </div>
          </div>
          <div className="streak-sep" />
          <div className="streak-col right">
            <div className="streak-info">
              <WeekIndicator
                streakCount={streakCount}
                studiedToday={checkStudyToday()}
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          <section className="deck-section">
            <h2>Recent</h2>
            <div className="deck-row">
              {decksLoading && <p>Loading...</p>}
              {error && <p className="error-message">{error.message}</p>}
              {!decksLoading && recentDecks.length === 0 && (
                <p>No recent decks available.</p>
              )}
              <FilteredDecks filteredAndSortedDecks={recentDecks} />
            </div>
          </section>

          <section className="deck-section">
            <div className="deck-header">
              <h2>Pinned Decks</h2>
              {!decksLoading && displayedPinnedDecks.length !== 0 && (
                <div className="pagination">
                  <Button
                    onClick={handlePreviousPinned}
                    variant="contained"
                    disabled={currentPinnedIndex === 0}
                    aria-label="Previous"
                    sx={{
                      height: "36px",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: "none",
                      border: "0.8px solid rgba(208, 213, 221, 1)",
                      "&:disabled": {
                        backgroundColor: "rgba(255, 255, 255, 1)", // Background when disabled
                        color: "rgba(150, 150, 150, 1)", // Text color when disabled
                      },
                    }}
                  >
                    <ArrowBackIosIcon
                      fontSize="small"
                      sx={{ color: "rgba(0, 0, 0, 1)" }}
                    />
                  </Button>
                  <Button
                    onClick={handleNextPinned}
                    variant="contained"
                    disabled={
                      currentPinnedIndex >=
                      Math.ceil(pinnedDecks.length / decksPerRow) - 1
                    }
                    aria-label="Next"
                    sx={{
                      height: "36px",
                      marginLeft: "10px",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: "none",
                      border: "0.8px solid rgba(208, 213, 221, 1)",
                      "&:disabled": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        color: "rgba(150, 150, 150, 1)",
                      },
                    }}
                  >
                    <ArrowForwardIosIcon
                      sx={{ color: "rgba(0, 0, 0, 1)" }}
                      fontSize="small"
                    />
                  </Button>
                </div>
              )}
            </div>
            <div className="deck-row">
              {error && <p className="error-message">{error.message}</p>}
              {!loading && displayedPinnedDecks.length === 0 && (
                <p>No pinned decks available.</p>
              )}
              <FilteredDecks filteredAndSortedDecks={displayedPinnedDecks} />
            </div>
          </section>
          <section
            style={{
              marginTop: displayedPinnedDecks.length === 0 ? 0 : "20px",
            }}
          >
            <div className="category-header">
              <h2>Browse All Categories</h2>
              {/* See All Button */}
              <Link
                to="/categories"
                style={{
                  marginTop: "0px",
                  color: "#3538CD",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                See All
              </Link>
            </div>
            <div className="categories-row">
              {categoriesError && <p>{categoriesError.message}</p>}
              {!loading && displayedCategories.length === 0 && (
                <p>No categories available</p>
              )}
              <FilteredCategories
                filteredAndSortedCategories={displayedCategories}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
