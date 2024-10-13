import React from "react";
import PropTypes from "prop-types";
import Category from "@/components/features/CategoryCard/Category";
import "./catcontainer.css";

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
  filteredAndSortedCategories: PropTypes.array.isRequired,
};

export default FilteredCategories;
