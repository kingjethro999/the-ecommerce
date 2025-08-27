"use client";

import { registerUser } from "@/actions/users";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage({ redirectUrl }: { redirectUrl: string }) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // If user is not signed in, redirect to login
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // If user exists and email is verified, proceed with registration
    if (user && user.primaryEmailAddress?.verification?.status === "verified") {
      handleUserRegistration();
      return;
    }

    // If user exists but email not verified, mark that a verification is needed
    if (user && user.primaryEmailAddress?.verification?.status !== "verified") {
      setVerificationSent(true);
    }
  }, [isLoaded, isSignedIn, user]);

  const handleUserRegistration = async () => {
    if (!user || isRegistering) return;

    setIsRegistering(true);
    setError(null);

    try {
      // Extract user details
      const userDetails = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        image: user.imageUrl || "",
        name:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      };

      // Call server action to register user
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

  const resendVerification = async () => {
    try {
      const primary = user?.emailAddresses.find(
        (e) => e.id === user?.primaryEmailAddressId
      );
      // Clerk requires a redirectUrl for the email_link strategy so that,
      // after clicking the email link, the user is redirected back here to
      // complete registration. We keep the intended post-registration
      // destination in the query string as redirect_url.
      const verifyCallbackUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/verify?redirect_url=${encodeURIComponent(
              redirectUrl
            )}`
          : `/verify?redirect_url=${encodeURIComponent(redirectUrl)}`;

      await primary?.prepareVerification({
        strategy: "email_link",
        redirectUrl: verifyCallbackUrl,
      });
      setVerificationSent(true);
    } catch (e) {
      console.error(e);
      setError("Failed to send verification email. Please try again.");
    }
  };

  const checkVerification = async () => {
    try {
      await user?.reload?.();
      if (user?.primaryEmailAddress?.verification?.status === "verified") {
        handleUserRegistration();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is signed in but email not verified
  if (
    user &&
    user.primaryEmailAddress?.verification?.status !== "verified" &&
    !isRegistering &&
    !error
  ) {
    const email = user.primaryEmailAddress?.emailAddress;
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
          <p className="text-gray-600 mb-4">
            We sent a verification link to <span className="font-medium">{email}</span>.
            Please check your inbox and click the link to continue.
          </p>
          {verificationSent && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4">
              Verification email sent. It may take a minute to arrive.
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resendVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Resend email
            </button>
            <button
              onClick={checkVerification}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              I've verified
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration in progress
  if (isRegistering) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            Setting up your account...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your registration.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Registration Error
            </h2>
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

  // This should not be reached, but just in case
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Verifying your account...</p>
      </div>
    </div>
  );
}
