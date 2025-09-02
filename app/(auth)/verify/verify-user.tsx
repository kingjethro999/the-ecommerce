"use client";

import { registerUser } from "@/actions/users";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage({ redirectUrl }: { redirectUrl: string }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    if (user) handleUserRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleUserRegistration = async () => {
    if (!user || isRegistering) return;

    setIsRegistering(true);
    setError(null);

    try {
      const userDetails = {
        email: user.email,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        name: user.name || "",
        image: user.image || "",
      } as any;

      const result = await registerUser(userDetails);

      if (result.success) {
        router.push(redirectUrl);
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (user && !isRegistering && !error) {
    const email = user.email;
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-2">Finish setup</h2>
          <p className="text-gray-600 mb-4">
            You are signed in as <span className="font-medium">{email}</span>. Click continue to complete your account setup.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleUserRegistration}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRegistering) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Setting up your account...</h2>
          <p className="text-gray-600">Please wait while we complete your registration.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Registration Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={handleUserRegistration}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Verifying your account...</p>
      </div>
    </div>
  );
}
