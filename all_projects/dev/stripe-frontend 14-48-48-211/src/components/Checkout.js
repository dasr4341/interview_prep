import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import CardIcon from "../images/credit-card.svg";
import ProductImage from "../images/product-image.jpg";

import "../styles.css";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  }
  return stripePromise;
};

export default function Checkout() {
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const item = {
    // price ID : 1. create the product in stripe dashboard there we can find the priceID of the product
    price: "price_1LmAUHIqzvL9jAUhaEfy4LK1",
    quantity: 1,
  };

  const checkoutOptions = {
    lineItems: [item],
    // mode can be :
    // 1. 'payment' -> one time  
    // 2. 'subscription' -> recurring
    mode: "subscription",
    successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", error);

    if (error) setStripeError(error.message);
    setLoading(false);
  };

  if (stripeError) alert(stripeError);

  return (
    <div className="checkout">
      <h1>Stripe Checkout</h1>
      <p className="checkout-title">Client Side Integration</p>
      <h1 className="checkout-price">$15</h1>
      <img
        className="checkout-product-image"
        src={ProductImage}
        alt="Product"
      />
      <button
        className="checkout-button"
        onClick={redirectToCheckout}
        disabled={isLoading}
      >
        <div className="grey-circle">
          <div className="purple-circle">
            <img className="icon" src={CardIcon} alt="credit-card-icon" />
          </div>
        </div>
        <div className="text-container">
          <p className="text">{isLoading ? "Loading..." : "Buy"}</p>
        </div>
      </button>
    </div>
  );
};

