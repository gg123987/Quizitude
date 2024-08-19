import { useParams } from 'react-router-dom';

const DeckDetail = () => {
  const { id } = useParams();
  // Fetch deck details using `id` and display them
  return <div>Deck Details for ID: {id}</div>;
};

export default DeckDetail;