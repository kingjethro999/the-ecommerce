import { confirmPayment } from "@/actions/payments";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Home,
  Receipt,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Loading component for payment confirmation
function PaymentConfirmationLoader() {
  return (
    <div className="w-full max-w-md mb-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 text-blue-700">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <span className="text-sm font-medium">Confirming payment...</span>
      </div>
    </div>
  );
}

// Payment confirmation component
async function PaymentConfirmation({ clientSecret }: { clientSecret: string }) {
  let paymentConfirmed = false;

  try {
    const paymentIntentId = clientSecret.split("_secret_")[0];
    const result = await confirmPayment(paymentIntentId);
    paymentConfirmed = result.success;
  } catch (error) {
    console.error("Payment confirmation failed:", error);
  }
  return (
    <div className="w-full max-w-md mb-6">
      <div
        className={`flex items-center gap-2 p-3 rounded-lg ${
          paymentConfirmed
            ? "bg-green-50 text-green-700"
            : "bg-yellow-50 text-yellow-700"
        }`}
      >
        <CheckCircle
          className={`w-5 h-5 ${
            paymentConfirmed ? "text-green-600" : "text-yellow-600"
          }`}
        />
        <span className="text-sm font-medium">
          {paymentConfirmed
            ? "Payment fully confirmed"
            : "Payment confirmation pending"}
        </span>
      </div>
    </div>
  );
}

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { amount, clientSecret } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <main className="max-w-3xl w-full mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Payment Successful!
            </h1>
            <p className="text-blue-100 text-lg">Thank you for your purchase</p>
          </div>

          {/* Amount Display */}
          <div className="p-8 bg-white">
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-2">Total Amount Paid</p>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                ${amount}
              </div>

              {/* Payment Status with Suspense */}
              {clientSecret && typeof clientSecret === "string" && (
                <Suspense fallback={<PaymentConfirmationLoader />}>
                  <PaymentConfirmation clientSecret={clientSecret} />
                </Suspense>
              )}

              {/* Order Info */}
              <div className="w-full max-w-md bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order Confirmed
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your order has been confirmed and will be shipped soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                <Link
                  href="/dashboard/orders"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                >
                  <Receipt className="w-5 h-5" />
                  View Orders
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-100 p-8 text-center bg-gray-50">
            <p className="text-gray-600 mb-4">
              A confirmation email has been sent to your email address
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>Need help?</span>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Order Steps */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                <p className="text-sm text-gray-600">
                  We've received your order
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Processing</h3>
                <p className="text-sm text-gray-600">
                  Your order is being processed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shipping Soon</h3>
                <p className="text-sm text-gray-600">
                  Your order will be shipped
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
