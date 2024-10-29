import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProVersion from "@/components/features/Payment/ProVersion/ProVersion";
import CheckoutForm from "@/components/features/Payment/Checkout/CheckoutForm";

vi.mock("@/components/features/Payment/Checkout/CheckoutForm", () => {
  return {
    __esModule: true,
    default: vi.fn(({ setShowCheckoutForm }) => (
      <div>
        <button onClick={() => setShowCheckoutForm(false)}>
          Close Checkout Form
        </button>
      </div>
    )),
  };
});

describe("ProVersion Component", () => {
  let setShowProVersionMock;

  beforeEach(() => {
    setShowProVersionMock = vi.fn();

    // Reset the mock before each test to avoid cross-test pollution
    CheckoutForm.mockClear();
    render(<ProVersion setShowProVersion={setShowProVersionMock} />);
  });

  test("renders ProVersion component with title and plans", () => {
    expect(screen.getByText(/Upgrade to Pro Version/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Gain access to more features/i)
    ).toBeInTheDocument();
    expect(screen.getByText("$1")).toBeInTheDocument();
    expect(screen.getByText("per month")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("per year")).toBeInTheDocument();
  });

  test("displays checkout form when Upgrade Now button is clicked", () => {
    // Click on the monthly plan upgrade button
    fireEvent.click(screen.getByTestId("month-upgrade-now"));

    // Check if the CheckoutForm is rendered
    expect(CheckoutForm).toHaveBeenCalledTimes(1);
  });

  test("closes ProVersion when close button is clicked", () => {
    const closeButton = screen.getByText(/X/i);
    fireEvent.click(closeButton);

    expect(setShowProVersionMock).toHaveBeenCalledWith(false);
  });

  test("closes the checkout form when the close button in CheckoutForm is clicked", () => {
    // Click on the monthly plan upgrade button to show the CheckoutForm
    fireEvent.click(screen.getByTestId("month-upgrade-now"));

    // Click on the close button within the CheckoutForm
    fireEvent.click(screen.getByText(/Close Checkout Form/i));

    // Check that CheckoutForm is no longer rendered
    expect(CheckoutForm).toHaveBeenCalledTimes(1); // Ensure it was called once
    expect(screen.queryByText(/Close Checkout Form/i)).not.toBeInTheDocument(); // Ensure the close button is no longer in the document
  });
});
