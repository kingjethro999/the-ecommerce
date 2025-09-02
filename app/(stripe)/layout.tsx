// removed Clerk auth
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    // If no user is signed in, redirect to the sign-in page
    redirect("/sign-in");
  }

  return <div>{children}</div>;
}
