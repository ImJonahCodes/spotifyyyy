"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("user@example.com");

  useEffect(() => {
    // Try to get the email from localStorage (would be set in a real app during login)
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <header className="bg-black p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
          <img
          src="/spotify.png"
          alt="Spotify"
          width={30}
          height={30}
        />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-[#282828] rounded-full h-8 w-8 flex items-center justify-center">
            <span className="text-white text-sm font-medium">{userEmail.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-white font-medium">{userEmail}</span>
        </div>
      </header>

      <div className="flex flex-col flex-1">
        {/* Main content without sidebar */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-black py-6 px-8 text-center text-gray-400 text-sm">
        <p>©2025 Spotify AB</p>
      </footer>
    </div>
  );
}
