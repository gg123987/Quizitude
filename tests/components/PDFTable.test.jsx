import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EnhancedTable from "@/components/features/Profile/PDFUploads/Table";

const mockData = [
  {
    id: 1,
    name: "File1",
    size: 2048000,
    deck_count: 3,
    uploaded_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "File2",
    size: 1024000,
    deck_count: 5,
    uploaded_at: "2023-02-01T00:00:00Z",
  },
];

describe("EnhancedTable Component", () => {
  const handleDelete = vi.fn();
  const handleGenerate = vi.fn();

  beforeEach(() => {
    // Clear previous mock calls
    handleDelete.mockClear();
    handleGenerate.mockClear();
  });

  test("renders the table with correct headers and data", () => {
    render(
      <EnhancedTable
        data={mockData}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
      />
    );

    // Check table headers
    expect(screen.getByText("File name")).toBeInTheDocument();
    expect(screen.getByText("File size")).toBeInTheDocument();
    expect(screen.getByText("Decks")).toBeInTheDocument();
    expect(screen.getByText("Date uploaded")).toBeInTheDocument();

    // Check for row data
    expect(screen.getByText("File1")).toBeInTheDocument();
    expect(screen.getByText("2000 KB")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2023")).toBeInTheDocument(); // Adjust date format if necessary
  });

  test("handles row selection and delete action", () => {
    render(
      <EnhancedTable
        data={mockData}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
      />
    );

    // Select the first row
    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    // Check if the delete button appears
    expect(screen.getByTestId("delete-button-1")).toBeInTheDocument();

    // Click delete button
    const deleteButton = screen.getByTestId("delete-button-1");
    fireEvent.click(deleteButton);

    // Ensure delete function is called with the correct ID
    expect(handleDelete).toHaveBeenCalledWith(1); // Check if delete is called for File1
  });

  test("handles generate action", () => {
    render(
      <EnhancedTable
        data={mockData}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
      />
    );

    // Click on the generate button for the first row
    const generateButton = screen.getAllByText("Generate")[0];
    fireEvent.click(generateButton);

    // Ensure generate function is called with the correct row data
    expect(handleGenerate).toHaveBeenCalledWith(mockData[0]); // Check if generate is called for File1
  });

  test("selects all rows when select all checkbox is clicked", () => {
    const { container } = render(
      <EnhancedTable
        data={mockData}
        onDelete={handleDelete}
        onGenerate={handleGenerate}
      />
    );

    // Log all checkboxes found
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');

    // Check if the select all checkbox is present
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /select all files/i,
    });
    fireEvent.click(selectAllCheckbox);

    // Check if both rows are selected
    expect(checkboxes.length).toBe(3); // Expect only the select all and the two file checkboxes

    expect(checkboxes[1].checked).toBe(true); // Check first file checkbox
    expect(checkboxes[2].checked).toBe(true); // Check second file checkbox

    // Deselect all
    fireEvent.click(selectAllCheckbox);
    expect(checkboxes[1].checked).toBe(false);
    expect(checkboxes[2].checked).toBe(false);
  });
});
