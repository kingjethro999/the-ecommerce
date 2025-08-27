"use server";

import { api } from "@/config/axios";
import axios from "axios";

export async function confirmPayment(paymentIntentId: string) {
  try {
    // Replace with your actual API endpoint
    const response = await api.post("/stripe/confirm-payment", {
      paymentIntentId: paymentIntentId,
    });
    console.log(response.data);
    // Return the response data
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error confirming payment:", error);

    // Return error response
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
