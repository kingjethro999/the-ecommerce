// removed Clerk auth
import React, { ReactNode } from "react";

export default function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}