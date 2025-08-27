import React from "react";
import VerifyPage from "./verify-user";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const redirectParam = searchParams?.redirect_url;
  const redirectUrl = typeof redirectParam === "string" ? redirectParam : "/";

  return (
    <div>
      <VerifyPage redirectUrl={redirectUrl} />
    </div>
  );
}
