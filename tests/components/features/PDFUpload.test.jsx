import React from "react";
import { render, screen } from "@testing-library/react";
import PDFUploads from "@/components/features/Profile/PDFUploads/PDFUpload";
import useModal from "@/hooks/useModal";
import useFiles from "@/hooks/useFiles";
import { useOutletContext } from "react-router-dom";

// Mocking necessary hooks and services
vi.mock("@/hooks/useModal");
vi.mock("@/hooks/useFiles");
vi.mock("@/services/fileService");

// Setup the userId mock for useOutletContext
vi.mock("react-router-dom", () => ({
  useOutletContext: vi.fn(),
}));

describe("PDFUploads Component", () => {
  const mockUserId = "123";
  const mockFiles = [
    { id: "file-1", name: "Document 1.pdf" },
    { id: "file-2", name: "Document 2.pdf" },
  ];

  beforeEach(() => {
    // Clear previous mocks
    vi.clearAllMocks();

    // Mock return value of useOutletContext
    useOutletContext.mockReturnValue({ userId: mockUserId });

    // Mock the useFiles hook
    useFiles.mockReturnValue({
      files: mockFiles,
      loading: false,
      error: null,
      refetch: vi.fn(), // Mock refetch function
    });

    // Mock the useModal hook
    useModal.mockReturnValue({
      openModalwithFile: vi.fn(), // Mock function to open modal
      modalOpen: false, // Initially, the modal is closed
    });
  });

  test("renders PDFUploads component", () => {
    render(<PDFUploads />);

    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("Document 1.pdf")).toBeInTheDocument(); // Check if files are rendered
    expect(screen.getByText("Document 2.pdf")).toBeInTheDocument();
  });

  test("displays error message when there is an error", () => {
    // Mock the useFiles hook to simulate an error
    useFiles.mockReturnValue({
      files: [],
      loading: false,
      error: { message: "Failed to fetch files" },
      refetch: vi.fn(),
    });

    render(<PDFUploads />);

    expect(
      screen.getByText(/error: failed to fetch files/i)
    ).toBeInTheDocument(); // Check if the error message is displayed
  });

  test("displays loading message while loading files", () => {
    // Mock the useFiles hook to simulate loading state
    useFiles.mockReturnValue({
      files: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<PDFUploads />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
