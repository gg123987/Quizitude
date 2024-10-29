import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewCategory from "@/components/features/NewCategory/NewCatModal";

describe("NewCategory Component", () => {
  let onCloseMock;
  let onSaveMock;

  beforeEach(() => {
    onCloseMock = vi.fn();
    onSaveMock = vi.fn().mockResolvedValue(); // Mock the onSave function as a successful promise
  });

  it("renders the modal when open is true", () => {
    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    expect(screen.getByText(/Add New Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Category/i })
    ).toBeInTheDocument();
  });

  it("does not render the modal when open is false", () => {
    render(
      <NewCategory open={false} onClose={onCloseMock} onSave={onSaveMock} />
    );

    expect(screen.queryByText(/Add New Category/i)).not.toBeInTheDocument();
  });

  it("calls onSave with the correct category name when valid input is provided", async () => {
    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, { target: { value: "New Category" } });
    fireEvent.click(screen.getByRole("button", { name: /Save Category/i }));

    await waitFor(() =>
      expect(onSaveMock).toHaveBeenCalledWith("New Category")
    );
    expect(onCloseMock).toHaveBeenCalled(); // Ensure modal closes after saving
  });

  it("shows an error when the input is empty", async () => {
    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Save Category/i }));

    expect(
      await screen.findByText(/Category name cannot be empty./i)
    ).toBeInTheDocument();
  });

  it("shows an error when onSave fails due to duplicate category name", async () => {
    onSaveMock.mockRejectedValueOnce(new Error("unique_category_name_user_id"));

    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, { target: { value: "Duplicate Category" } });
    fireEvent.click(screen.getByRole("button", { name: /Save Category/i }));

    expect(
      await screen.findByText(/A category with this name already exists./i)
    ).toBeInTheDocument();
  });

  it("shows a general error when onSave fails for other reasons", async () => {
    onSaveMock.mockRejectedValueOnce(new Error("Some other error"));

    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    const input = screen.getByLabelText(/Category Name/i);
    fireEvent.change(input, { target: { value: "Any Category" } });
    fireEvent.click(screen.getByRole("button", { name: /Save Category/i }));

    expect(
      await screen.findByText(/An error occurred while creating the category./i)
    ).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    render(
      <NewCategory open={true} onClose={onCloseMock} onSave={onSaveMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Close/i }));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
