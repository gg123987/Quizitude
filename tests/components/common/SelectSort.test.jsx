import { render, screen, fireEvent } from "@testing-library/react";
import SelectSort from "@/components/common/SelectSort";

describe("SelectSort Component", () => {
  const mockSortOptions = [
    { value: "name", label: "Name" },
    { value: "date", label: "Date" },
  ];

  const mockOnSortChange = vi.fn();

  beforeEach(() => {
    // Clear mock calls before each test
    mockOnSortChange.mockClear();
  });

  test("renders with default sort options", () => {
    render(<SelectSort onSortChange={mockOnSortChange} />);

    // Check if the default sort option is rendered
    expect(screen.getByRole("combobox")).toHaveTextContent("Recently Created");
  });

  test("renders with custom sort options", () => {
    render(
      <SelectSort
        sortOptions={mockSortOptions}
        onSortChange={mockOnSortChange}
      />
    );

    // Check if the custom sort options are rendered
    expect(screen.getByRole("combobox")).toHaveTextContent("Name");

    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole("combobox"));

    const dateOption = screen.getByText("Date");
    expect(dateOption).toBeInTheDocument();
  });

  test("calls onSortChange when an option is selected", () => {
    render(
      <SelectSort
        sortOptions={mockSortOptions}
        onSortChange={mockOnSortChange}
      />
    );

    // Open the dropdown
    fireEvent.mouseDown(screen.getByRole("combobox"));

    // Select the second option (Date)
    const dateOption = screen.getByText("Date");
    fireEvent.click(dateOption);

    // Check if the mock function was called with the correct value
    expect(mockOnSortChange).toHaveBeenCalledWith("date");
  });

  test("has correct width when passed as a prop", () => {
    render(<SelectSort width="30ch" onSortChange={mockOnSortChange} />);

    const textField = screen
      .getByRole("combobox")
      .closest(".MuiTextField-root");
    expect(textField).toHaveStyle("width: 30ch");
  });
});
