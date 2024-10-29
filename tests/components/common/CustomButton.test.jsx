import React from "react";
import { render, screen } from "@testing-library/react";
import CustomButton from "@/components/common/CustomButton";

describe("CustomButton", () => {
  test("renders button with text", () => {
    render(<CustomButton>Click Me</CustomButton>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click Me");
  });

  test("renders button with icon", () => {
    const mockIcon = <span>🔥</span>;
    render(<CustomButton icon={mockIcon}>Click Me</CustomButton>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click Me");
    expect(buttonElement).toContainHTML("🔥"); // Check if the icon is rendered
  });

  test("applies custom font size", () => {
    render(<CustomButton fontSize="1.5rem">Click Me</CustomButton>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toHaveStyle("font-size: 1.5rem");
  });

  test("renders with default font size", () => {
    render(<CustomButton>Click Me</CustomButton>);
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toHaveStyle("font-size: 0.9rem"); // Check default font size
  });

  test("handles additional props correctly", () => {
    const handleClick = vi.fn();
    render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    buttonElement.click();

    expect(handleClick).toHaveBeenCalledTimes(1); // Verify the click event
  });

  test("applies additional custom styles", () => {
    render(
      <CustomButton style={{ backgroundColor: "red" }}>Click Me</CustomButton>
    );

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toHaveStyle("background-color: rgb(255, 0, 0)");
  });
});
