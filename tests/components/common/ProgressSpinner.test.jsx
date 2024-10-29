import React from "react";
import { render, screen } from "@testing-library/react";
import CircularProgressSpinner from "@/components/common/CircularProgressSpinner";

describe("CircularProgressSpinner", () => {
  test("renders with 0% progress", () => {
    render(<CircularProgressSpinner value={0} />);

    const progressText = screen.getByText(/0%/i);
    const circularProgress = screen.getByRole("progressbar");

    expect(progressText).toBeInTheDocument();
    expect(circularProgress).toHaveAttribute("aria-valuenow", "0");
    expect(circularProgress).toHaveAttribute("aria-valuemax", "100");
    expect(circularProgress).toHaveAttribute("aria-valuemin", "0");
  });

  test("renders with 50% progress", () => {
    render(<CircularProgressSpinner value={50} />);

    const progressText = screen.getByText(/50%/i);
    const circularProgress = screen.getByRole("progressbar");

    expect(progressText).toBeInTheDocument();
    expect(circularProgress).toHaveAttribute("aria-valuenow", "50");
  });

  test("renders with 100% progress", () => {
    render(<CircularProgressSpinner value={100} />);

    const progressText = screen.getByText(/100%/i);
    const circularProgress = screen.getByRole("progressbar");

    expect(progressText).toBeInTheDocument();
    expect(circularProgress).toHaveAttribute("aria-valuenow", "100");
  });

  test("does not render progress greater than 100%", () => {
    render(<CircularProgressSpinner value={110} />);

    const progressText = screen.getByText(/100%/i); // It should still display 100%
    const circularProgress = screen.getByRole("progressbar");

    expect(progressText).toBeInTheDocument();
    expect(circularProgress).toHaveAttribute("aria-valuenow", "100");
  });
});
