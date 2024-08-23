import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import CustomButton from "@/components/common/CustomButton";
import { useNavigate } from "react-router-dom";
import "./deck.css";

const Deck = ({ deck }) => {
  const { categories, name, flashcards_count } = deck;
  const categoryName = categories.name;
  const categoryId = categories.id;
  const navigate = useNavigate();

  const handleClickDeck = () => {
    navigate(`/decks/${deck.id}`);
  }

  const handleClickCategory = (e) => {
    e.stopPropagation();
    navigate(`/categories/${categoryId}`);
  }

  return (
    <div className="deck-card" onClick={handleClickDeck}>
      <div className="category">
        <CustomButton
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