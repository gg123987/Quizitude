import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilteredCategories from "@/components/features/DisplayCategories/FilteredCategories";
import { useNavigate, MemoryRouter } from "react-router-dom";

vi.mock("@/components/features/CategoryCard/Category", () => {
  return {
    default: function MockCategory({ category, onRefreshCategories }) {
      return (
        <div
          data-testid={`category-${category.id}`}
          onClick={onRefreshCategories}
        >
          {category.name}
        </div>
      );
    },
  };
});

describe("FilteredCategories", () => {
  const mockCategories = [
    { id: 1, name: "Category A" },
    { id: 2, name: "Category B" },
  ];

  const mockOnRefreshCategories = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks between tests
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <FilteredCategories
          filteredAndSortedCategories={mockCategories}
          onRefreshCategories={mockOnRefreshCategories}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Category B")).toBeInTheDocument();
  });

  it("renders the correct number of Category components", () => {
    render(
      <MemoryRouter>
        <FilteredCategories
          filteredAndSortedCategories={mockCategories}
          onRefreshCategories={mockOnRefreshCategories}
        />
      </MemoryRouter>
    );

    const categoryElements = screen.getAllByTestId(/category/i);
    expect(categoryElements.length).toBe(mockCategories.length);
  });

  it("calls onRefreshCategories when a category is clicked", () => {
    render(
      <MemoryRouter>
        <FilteredCategories
          filteredAndSortedCategories={mockCategories}
          onRefreshCategories={mockOnRefreshCategories}
        />
      </MemoryRouter>
    );

    // Simulate clicking on "Category A"
    fireEvent.click(screen.getByText("Category A"));
    expect(mockOnRefreshCategories).toHaveBeenCalledTimes(1);
  });
});
