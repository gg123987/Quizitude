import React from "react";
import PropTypes from "prop-types";
import Category from "@/components/features/CategoryCard/Category";
import "./catcontainer.css";

/**
 * FilteredCategories Component
 *
 * This component is responsible for displaying a list of categories that have been
 * filtered and sorted. It uses the Category component to render each individual category.
 *
 * Props:
 * - filteredAndSortedCategories (Array): An array of category objects that have been filtered and sorted.
 * - onRefreshCategories (Function): A callback function to refresh the categories.
 *
 * The component is memoized using React.memo to prevent unnecessary re-renders.
 */
const FilteredCategories = React.memo(
  ({ filteredAndSortedCategories, onRefreshCategories }) => (
    <div className="cat-container">
      {filteredAndSortedCategories.map((category) => (
        <Category
          key={category.id}
          category={category}
          onRefreshCategories={onRefreshCategories}
        />
      ))}
    </div>
  )
);

FilteredCategories.displayName = "FilteredCategories";

FilteredCategories.propTypes = {
  filteredAndSortedCategories: PropTypes.array.isRequired, // Array of filtered and sorted category objects
  onRefreshCategories: PropTypes.func.isRequired, // Callback function to refresh categories
};

export default FilteredCategories;
