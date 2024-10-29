import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutForm from "@/components/features/Payment/Checkout/CheckoutForm";

describe("CheckoutForm Component", () => {
  let setShowCheckoutFormMock;

  beforeEach(() => {
    setShowCheckoutFormMock = vi.fn();
  });

  it("renders the checkout form", () => {
    render(<CheckoutForm setShowCheckoutForm={setShowCheckoutFormMock} />);

    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name on Card/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Expiration Date \(MM\/YY\)/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Complete Subscription/i })
    ).toBeInTheDocument();
  });

  it("shows error messages for invalid input", async () => {
    render(<CheckoutForm setShowCheckoutForm={setShowCheckoutFormMock} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Complete Subscription/i })
    );

    // Check for error messages
    expect(
      await screen.findByText(/Card number must be 16 digits long/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Name on card is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Expiration date must be in MM\/YY format/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/CVV must be 3 digits long/i)
    ).toBeInTheDocument();
  });

  it("validates expiration date correctly", async () => {
    render(<CheckoutForm setShowCheckoutForm={setShowCheckoutFormMock} />);

    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "1234567812345678" },
    });
    fireEvent.change(screen.getByLabelText(/Name on Card/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Expiration Date \(MM\/YY\)/i), {
      target: { value: "01/22" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Complete Subscription/i })
    );

    // Check that no errors are shown for valid input
    expect(
      screen.queryByText(/Card number must be 16 digits long/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Name on card is required/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Expiration date must be in MM\/YY format/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/CVV must be 3 digits long/i)
    ).not.toBeInTheDocument();
  });

  it("submits the form successfully with valid data", async () => {
    render(<CheckoutForm setShowCheckoutForm={setShowCheckoutFormMock} />);

    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "1234567812345678" },
    });
    fireEvent.change(screen.getByLabelText(/Name on Card/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Expiration Date \(MM\/YY\)/i), {
      target: { value: "01/25" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Complete Subscription/i })
    );
  });

  it("closes the form when the close button is clicked", () => {
    render(<CheckoutForm setShowCheckoutForm={setShowCheckoutFormMock} />);

    fireEvent.click(screen.getByTestId("close-button")); // Click on the close button

    expect(setShowCheckoutFormMock).toHaveBeenCalledWith(false);
  });
});
