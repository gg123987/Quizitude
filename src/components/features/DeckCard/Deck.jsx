import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import CustomButton from "@/components/common/CustomButton";
import { useNavigate } from "react-router-dom";
import "./deck.css";

/**
 * Deck component represents a single deck card with its category, name, and flashcards count.
 * It provides navigation to the deck details and category decks.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.deck - The deck object.
 * @param {number} props.deck.id - The unique identifier of the deck.
 * @param {Object} props.deck.categories - The category object of the deck.
 * @param {number} props.deck.categories.id - The unique identifier of the category.
 * @param {string} props.deck.categories.name - The name of the category.
 * @param {string} props.deck.name - The name of the deck.
 * @param {number} props.deck.flashcards_count - The number of flashcards in the deck.
 */
const Deck = ({ deck }) => {
  const { categories, name, flashcards_count } = deck;
  const categoryName = categories.name;
  const categoryId = categories.id;
  const navigate = useNavigate();

  /**
   * Handles the click event on the deck card to navigate to the deck details page.
   */
  const handleClickDeck = () => {
    navigate(`/decks/${deck.id}`);
  };

  /**
   * Handles the click event on the category button to navigate to the decks filtered by category.
   * @param {Event} e - The click event.
   */
  const handleClickCategory = (e) => {
    e.stopPropagation();

    const params = new URLSearchParams();
    params.append("categoryId", categoryId);
    params.append("categoryName", categoryName);
    navigate(`/decks?${params.toString()}`);
  };

  return (
    <div className="deck-card" onClick={handleClickDeck}>
      <div className="category">
        <CustomButton
          className="category-button"
          variant="contained"
          fontSize="0.7rem"
          style={{
            borderRadius: "30px",
            color: "#1D2939",
            backgroundColor: "#EAECF0",
            boxShadow: "none",
            width: "fit-content",
            marginBottom: "0px",
            padding: "2px 10px",
          }}
          onClick={handleClickCategory}
        >
          {categoryName}
        </CustomButton>
      </div>
      <div className="name">
        <Typography
          variant="body1"
          color="textSecondary"
          style={{
            fontFamily: "Inter",
            fontSize: "1.2rem",
            fontWeight: "bold",
            margin: "0px",
            width: "fit-content",
          }}
        >
          {name}
        </Typography>
      </div>
      <div className="flashcards">
        <Typography
          variant="body2"
          color="textSecondary"
          style={{
            fontFamily: "Inter",
            fontWeight: "400",
            fontSize: "12px",
            margin: "0px",
            width: "fit-content",
          }}
        >
          {flashcards_count}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{
            fontFamily: "Inter",
            fontWeight: "400",
            fontSize: "12px",
            margin: "0px",
            width: "fit-content",
          }}
        >
          flashcards
        </Typography>
      </div>
    </div>
  );
};

Deck.propTypes = {
  deck: PropTypes.shape({
    id: PropTypes.number.isRequired,
    categories: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    flashcards_count: PropTypes.number.isRequired,
  }).isRequired,
};

export default Deck;
