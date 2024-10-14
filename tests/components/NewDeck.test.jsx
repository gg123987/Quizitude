import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import NewDeck from "@/components/features/NewDeck/NewDeckModal";
import { expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import useAuth from "@/hooks/useAuth";
import useCategories from "@/hooks/useCategories";
import useDecks from "@/hooks/useDecks";
import fetchLLMResponse from "@/api/LLM";
import { MenuItem, Select } from "@mui/material";

beforeEach(() => {
  vi.clearAllMocks();
});

// Mock useModal to ensure the modal is open during the test
vi.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    modalOpen: true,
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }),
}));

describe("NewDeck Component", () => {
  beforeEach(() => {
    // Mock return values for hooks
    useAuth.mockReturnValue({ user: { id: 1 } });
    useCategories.mockReturnValue({
      categories: [{ id: "1", name: "Test Category" }],
      categoriesLoading: false,
      categoriesError: false,
      refreshCategories: vi.fn(),
    });
    useDecks.mockReturnValue({
      decks: [{ name: "Existing Deck" }],
    });
  });

  it("renders NewDeck modal correctly", () => {
    render(<NewDeck />);

    expect(screen.getByPlaceholderText("Deck Name")).to.exist;
    expect(screen.getByLabelText("No of Questions")).to.exist;
    expect(screen.getByLabelText("Type of Question")).to.exist;
    expect(screen.getByLabelText("Category")).to.exist;
  });

  it("renders the NewDeck component and handles input changes", () => {
    render(<NewDeck />);

    // Check if the deck name input is rendered
    const deckNameInput = screen.getByPlaceholderText("Deck Name");
    expect(deckNameInput).to.exist;

    // Simulate typing a deck name
    fireEvent.change(deckNameInput, { target: { value: "New Deck Name" } });
    expect(deckNameInput.value).toBe("New Deck Name");
  });

  it("displays error when mandatory fields are missing", async () => {
    render(<NewDeck />);

    const generateButton = screen.getByRole("button", {
      name: /generate flashcards/i,
    });

    // Click the generate button without filling the form
    fireEvent.click(generateButton);

    // Check if the error message is displayed
    await waitFor(() => {
      const errorMessage = screen.getByText("Please enter a deck name.");
      expect(errorMessage).to.exist;
    });
  });

  it("handles file size validation", () => {
    // Mock window.alert
    window.alert = vi.fn();

    render(<NewDeck />);

    // Simulate uploading an oversized file
    const oversizedFile = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(oversizedFile, "size", { value: 35 * 1024 * 1024 }); // 35 MB

    // Simulate file upload
    const fileInput = screen.getByTestId("pdf-upload");

    fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

    // Check if the file was rejected due to size
    expect(window.alert).toHaveBeenCalledWith(
      "File size exceeds the maximum allowed size (30MB)."
    );
  });
});
