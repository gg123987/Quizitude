import React from "react";
import PropTypes from "prop-types";
import Deck from "@/components/features/DeckCard/Deck";
import "./deckcontainer.css";

/**
 * FilteredDecks is a memoized functional component that renders a list of decks.
 * It receives a list of filtered and sorted decks as a prop and maps over them to render each deck.
 *
 * @component
 * @example
 * const decks = [{ id: 1, name: 'Deck 1' }, { id: 2, name: 'Deck 2' }];
 * return <FilteredDecks filteredAndSortedDecks={decks} />;
 *
 * @param {Object[]} filteredAndSortedDecks - Array of deck objects that have been filtered and sorted.
 * @param {number} filteredAndSortedDecks.id - Unique identifier for each deck.
 * @param {string} filteredAndSortedDecks.name - Name of the deck.
 *
 * @returns {JSX.Element} A container div with a list of Deck components.
 */
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
