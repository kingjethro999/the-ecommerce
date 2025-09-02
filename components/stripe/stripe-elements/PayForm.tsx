"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

import { CartItem } from "@/types/cart";
import { useAuth } from "@/providers/AuthProvider";
import { id } from "date-fns/locale";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const successUrl = process.env.NEXT_PUBLIC_BASE_URL;
const PayForm = ({ cartItems }: { cartItems: CartItem[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const amount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const { user } = useAuth();
  const customer = {
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.image || "",
    id: user?.id || "",
  };
  console.log(customer);
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            products: cartItems.map((item) => {
              return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.imageUrl,
              };
            }),
            customer: {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              avatar: customer.avatar,
            },
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    createPaymentIntent();
  }, [cartItems]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${successUrl}/payment-success?amount=${amount}&&clientSecret=${clientSecret}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5  mt-2 font-bold disabled:opacity-50 disabled:animate-pulse bg-blue-600  py-3 rounded-lg  hover:bg-blue-700 transition-colors"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default PayForm;
