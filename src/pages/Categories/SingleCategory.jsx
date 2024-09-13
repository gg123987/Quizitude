import { useParams } from 'react-router-dom';

const CategoryDetail = () => {
  const { id } = useParams();
  // Fetch category details using `id` and display them
  return <div>Category Details for ID: {id}</div>;
};

export default CategoryDetail;