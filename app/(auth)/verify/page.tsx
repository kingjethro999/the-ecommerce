import React from "react";
import VerifyPage from "./verify-user";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirectParam = params?.redirect_url;
  const redirectUrl = typeof redirectParam === "string" ? redirectParam : "/";

  return (
    <div>
      <VerifyPage redirectUrl={redirectUrl} />
    </div>
  );
}
