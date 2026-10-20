import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import StoreProvider from "../components/storeProvider";
import SessionManager from "../components/session_manager";

export const metadata: Metadata = {
  title: "chap-chat",
  description: "chap-chat for all your organizational needs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StoreProvider>
          <SessionManager>
            {children}
            <Toaster position="top-right" />
          </SessionManager>
        </StoreProvider>
      </body>
    </html>
  );
}
