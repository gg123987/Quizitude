import React from "react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import useCategories from "@/hooks/useCategories";
import CircularProgress from "@mui/material/CircularProgress";
import SelectSort from "@/components/common/SelectSort";
import CustomButton from "@/components/common/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import NewCategory from "@/components/features/NewCategory/NewCatModal";
import { createCategory } from "@/services/categoryService";
import ClearIcon from "@mui/icons-material/Clear";
import FilteredCategories from "@/components/features/DisplayCategories/FilteredCategories";
import { useMediaQuery } from "@mui/material";
import useModal from "@/hooks/useModal";
import "./categories.css";

// Custom styled TextField component
const CustomTextField = styled(TextField)(() => ({
  width: "280px",
  backgroundColor: "white",
  marginBottom: "0px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D0D5DD",
    },
    "&:hover fieldset": {
      borderColor: "#888",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3538CD",
    },
  },
}));

const Categories = () => {
  // Get userId from the outlet context
  const { userId } = useOutletContext();
  // Fetch categories and related states
  const { categories, loading, error, refreshCategories } =
    useCategories(userId);
  const { openModal } = useModal();
  const [value, setValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Recently Created"); // Default sort option
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);

  // Media queries for responsive design
  const isLargeScreen = useMediaQuery("(min-width: 1630px)");
  const isMediumScreen = useMediaQuery("(min-width: 1247px)");
  const isSmallScreen = useMediaQuery("(min-width: 450px)");

  // Determine the number of columns based on screen size
  const columns = isLargeScreen
    ? 4
    : isMediumScreen
    ? 3
    : isSmallScreen
    ? 2
    : 1;
  const rows = 6; // Fixed number of rows per page
  const categoriesPerPage = rows * columns;

  // Refresh categories
  const handleRefreshCategories = async () => {
    await refreshCategories(); // Fetch categories again
  };

  // Filter categories based on search query
  const filteredCategories = React.useMemo(() => {
    if (searchQuery.trim() === "") {
      return categories;
    }
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Open new category modal
  const handleOpenModal = () => {
    setNewCategoryModalOpen(true);
  };

  // Handle search input change
  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchQuery(event.target.value);
  };

  // Update clear icon visibility based on search query
  React.useEffect(() => {
    setShowClearIcon(searchQuery === "" ? "none" : "flex");
  }, [searchQuery]);

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Sort and filter categories
  const filteredAndSortedCategories = React.useMemo(() => {
    let sortedCategories = [...filteredCategories];

    // Apply sorting
    switch (sortOption) {
      case "Recently Created":
        sortedCategories.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "Last Modified":
        sortedCategories.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        break;
      case "Alphabetical":
        sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Oldest":
        sortedCategories.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      default:
        break; // No sorting
    }

    return sortedCategories;
  }, [filteredCategories, value, sortOption]);

  const totalCategories = filteredAndSortedCategories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);

  // Slice categories for current page
  const currentCategories = React.useMemo(() => {
    const start = (currentPage - 1) * categoriesPerPage;
    const end = start + categoriesPerPage;
    return filteredAndSortedCategories.slice(start, end);
  }, [filteredAndSortedCategories, currentPage, categoriesPerPage]);

  // Handle pagination next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle pagination previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Save new category
  const handleSaveNewCategory = async (categoryName) => {
    const newCategory = { name: categoryName, user_id: userId };
    const category = await createCategory(newCategory);
    setNewCategoryModalOpen(false); // Close the modal after saving

    // Refresh the categories
    handleRefreshCategories();
  };

  return (
    <div className="all-categories">
      <div className="all-categories-header">
        <h1 className="categories-title">Categories</h1>
        {categories.length > 0 && (
          <div className="count-badge">
            {totalCategories === 1 ? (
              <p className="deck-count">{totalCategories} category</p>
            ) : (
              <p className="deck-count">{totalCategories} categories</p>
            )}
          </div>
        )}
      </div>
      <div className="all-categories-filter">
        <div className="col-left">
          <CustomTextField
            id="outlined-basic"
            placeholder="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  data-testid="clear-search"
                  position="end"
                  style={{ display: showClearIcon }}
                  onClick={() => setSearchQuery("")}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "50%",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => setSearchQuery("")}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <ClearIcon />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="col-right">
          {categories.length > 0 && (
            <CustomButton
              onClick={handleOpenModal}
              icon={<AddIcon />}
              style={{
                color: "#3538CD",
                backgroundColor: "transparent",
                width: "150px",
                border: "1.4px solid #3538CD",
              }}
            >
              {"New Category"}
            </CustomButton>
          )}
          <SelectSort onSortChange={handleSortChange} />
        </div>
      </div>

      <div className="all-categories-data">
        {loading && <CircularProgress color="inherit" />}
        {error && <p className="error-message">{error.message}</p>}
        {!loading && !error && categories.length === 0 && (
          <Box
            sx={{
              padding: "20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <h2>You have no categories yet</h2>
            <p style={{ textAlign: "center" }}>
              Create your first category by clicking the button below
            </p>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CustomButton
                onClick={handleOpenModal}
                icon={<AddIcon />}
                style={{
                  color: "#3538CD",
                  backgroundColor: "transparent",
                  width: "150px",
                  border: "1.4px solid #3538CD",
                }}
              >
                {"New Category"}
              </CustomButton>
            </Box>
          </Box>
        )}
        <div>
          <FilteredCategories
            filteredAndSortedCategories={currentCategories}
            onRefreshCategories={handleRefreshCategories}
          />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="footer">
          <div className="pagination-controls">
            <CustomButton
              className="pagination-button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={{
                color: "#344054",
                backgroundColor: "#FFFFFF",
                width: "100px",
                borderColor: "",
                border: "1px solid #D0D5DD",
              }}
            >
              Previous
            </CustomButton>
            <span className="pagination-text">
              Page {currentPage} of {totalPages}
            </span>
            <CustomButton
              className="pagination-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                color: "#344054",
                backgroundColor: "#FFFFFF",
                width: "100px",
                borderColor: "",
                border: "1px solid #D0D5DD",
              }}
            >
              Next
            </CustomButton>
          </div>
        </div>
      )}
      {newCategoryModalOpen && (
        <NewCategory
          open={newCategoryModalOpen}
          onClose={() => setNewCategoryModalOpen(false)}
          onSave={handleSaveNewCategory}
        />
      )}
    </div>
  );
};

export default Categories;
