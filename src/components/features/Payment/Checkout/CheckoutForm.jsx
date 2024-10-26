import React, { useState } from 'react';
import './checkoutForm.css';
import { TextField, Button, Grid } from '@mui/material';

const CheckoutForm = ({ setShowCheckoutForm }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  // Get current month and year
  const getCurrentMonthYear = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear() % 100; 
    return { currentMonth, currentYear };
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors = {};

    // Checking card length
    if (!cardNumber || cardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits long';
    }

    // Checking name isn't empty
    if (!nameOnCard) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    // Expiration date MM/YY format
    const { currentMonth, currentYear } = getCurrentMonthYear();
    if (!expirationDate || expirationDate.length !== 5) {
      newErrors.expirationDate = 'Expiration date must be in MM/YY format';
    } else {
      const [expMonth, expYear] = expirationDate.split('/').map(Number);

      // Check if expiration date is valid and in the future
      if (
        expYear < currentYear || 
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        newErrors.expirationDate = 'Expiration date must be in the future';
      }
    }

    // Validate that CVV is 3 digits
    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits long';
    }
    return newErrors;
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
    if (value.length > 4) {
      value = value.slice(0, 4); // Limit input to 4 digits (MMYY)
    }
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2); // Add '/' after MM
    }
    setExpirationDate(value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log('Form submitted successfully');
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="close-button" onClick={() => setShowCheckoutForm(false)}>X</div>
        <h1 className="checkout-title">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                variant="outlined"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // Only allow digits
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name on Card"
                variant="outlined"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                error={!!errors.nameOnCard}
                helperText={errors.nameOnCard}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiration Date (MM/YY)"
                variant="outlined"
                value={expirationDate}
                onChange={handleExpirationDateChange}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                variant="outlined"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                error={!!errors.cvv}
                helperText={errors.cvv}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                sx={{ backgroundColor: "#3538cd" }}
                type="submit"
              >
                Complete Subscription
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
