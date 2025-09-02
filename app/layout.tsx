import { type Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { QueryProvider } from "@/providers/ReactQueryClient";
import { Toaster } from "sonner";
import { ourFileRouter } from "./api/uploadthing/core";
import { AuthProvider } from "@/providers/AuthProvider";

const manrope = Manrope({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Store Ug - Your One-Stop Shop for All Your Needs",
  description:
    "Discover a wide range of quality products at JB Store Ug UG, located in Kampala downtown. Explore our extensive collection, including fashion, electronics, and more. From the latest gadgets to trendy fashion, we've got it all. Call us at +256 752 815998 for personalized assistance and unbeatable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body className={manrope.className}>
          <AuthProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <Toaster richColors />
            {children}
          </AuthProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
