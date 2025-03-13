import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

// Define fonts
const circularStd = {
  variable: "--font-circular",
};

export const metadata: Metadata = {
  title: "Login - Spotify",
  description: "Log in to your Spotify account",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${circularStd.variable}`}>
      <ClientBody>
        {children}
      </ClientBody>
    </html>
  );
}
