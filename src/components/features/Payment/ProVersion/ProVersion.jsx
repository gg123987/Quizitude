import React, { useState } from "react";
import "./proVersion.css";
import Button from "@mui/material/Button";
import CheckoutForm from "../Checkout/CheckoutForm";

const ProVersion = ({ setShowProVersion }) => {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleUpgradeClick = () => {
    setShowCheckoutForm(true);
  };

  const handleGoBackToProVersion = () => {
    setShowCheckoutForm(false);
  };

  return (
    <div className="pro-version-container">
      {showCheckoutForm ? (
        <CheckoutForm setShowCheckoutForm={handleGoBackToProVersion} />
      ) : (
        <div className="pro-version-content">
          <div
            className="close-button"
            onClick={() => setShowProVersion(false)}
          >
            X
          </div>
          <h1 className="pro-version-title">Upgrade to Pro Version</h1>
          <p className="pro-version-subtitle">
            Gain access to more features on our app to help you study smarter
            and faster
          </p>
          <div className="pro-version-plans">
            <div className="plan monthly-plan">
              <h2>$1</h2>
              <p>per month</p>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#3538cd" }}
                fullWidth
                onClick={handleUpgradeClick}
              >
                Upgrade Now
              </Button>
              <span className="popular-badge">Popular</span>
            </div>
            <div className="plan annual-plan">
              <h2>$10</h2>
              <p>per year</p>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#3538cd" }}
                fullWidth
                onClick={handleUpgradeClick}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProVersion;
