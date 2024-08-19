import React from "react";
import PropTypes from "prop-types";
import Deck from "@/components/features/DeckCard/Deck";
import './deckcontainer.css';

const FilteredDecks = React.memo(({ filteredAndSortedDecks }) => (
  <div className="deck-container">
    {filteredAndSortedDecks.map((deck) => (
      <Deck key={deck.id} deck={deck} />
    ))}
  </div>
));

FilteredDecks.displayName = "FilteredDecks";
FilteredDecks.propTypes = {
  filteredAndSortedDecks: PropTypes.array.isRequired,
};

export default FilteredDecks;