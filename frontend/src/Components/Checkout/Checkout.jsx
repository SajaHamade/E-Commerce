import React, { useState } from 'react';
import './Chekout.css';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const { email, username, finalPrice } = location.state.checkoutDetails;
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Simulate placing the order
    setOrderPlaced(true);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {orderPlaced ? (
        <div className="order-confirmation">
          <h2>Thank you for your order, {username}!</h2>
          <p>Your order will be delivered within a week.</p>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="invoice">
            <h2>{username}, your invoice:</h2>
            <p>Email: {email}</p>
            <p>Final Price: ${finalPrice}</p>
          </div>

          <form className="payment-form" onSubmit={handleOrderSubmit}>
            <h3>Enter Your Payment Details</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                required
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={cardDetails.expirationDate}
                onChange={handleInputChange}
                required
                placeholder="MM/YY"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                required
                placeholder="123"
              />
            </div>

            <button 
  type="submit" 
  className="submit-button"  
  onClick={() => { window.location.href = '/'; }}
>
  Place Order
</button>

          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
