import PropTypes from 'prop-types';
import FlashcardEdit from './FlashcardEdit';

const FlashcardEditList = ({ flashcards }) => {
	return (
		<div className="list-container">
			{flashcards.map(flashcard => (
				<FlashcardEdit key={flashcard.id} flashcard={flashcard} />
			))}
		</div>
	);
};

FlashcardEditList.propTypes = {
	flashcards: PropTypes.array.isRequired,
};

export default FlashcardEditList;