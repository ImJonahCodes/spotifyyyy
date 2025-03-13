import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, PlusCircle, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Saved Payment Cards - Spotify",
  description: "Manage your saved payment cards",
};

export default function SavedPaymentCardsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Payment methods</h1>
        <p className="text-gray-400">
          Manage your saved payment cards and payment methods
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Saved cards</h2>
            <Button
              variant="outline"
              className="text-white bg-transparent border border-gray-700 hover:bg-[#282828] rounded-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add new card
            </Button>
          </div>

          {/* Example saved card */}
          <Card className="bg-[#181818] border-gray-800 p-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-[#282828] p-3 rounded-md">
                  <CreditCard className="h-6 w-6 text-[#1ed760]" />
                </div>
                <div>
                  <p className="text-white font-medium">Visa ending in 4242</p>
                  <p className="text-gray-400 text-sm">Expires 12/2025</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-[#282828]"
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete card</span>
              </Button>
            </div>
          </Card>

          {/* Alternative payment methods section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-white mb-4">Alternative payment methods</h2>
            <p className="text-gray-400 mb-4">
              You can also pay for Spotify with these payment methods:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#181818] border-gray-800 p-4 cursor-pointer hover:bg-[#282828] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#282828] p-2 rounded-md">
                    <div className="h-8 w-8 rounded-full bg-[#3b5998] flex items-center justify-center font-bold text-white">P</div>
                  </div>
                  <p className="text-white font-medium">PayPal</p>
                </div>
              </Card>
              <Card className="bg-[#181818] border-gray-800 p-4 cursor-pointer hover:bg-[#282828] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#282828] p-2 rounded-md">
                    <div className="h-8 w-8 flex items-center justify-center font-bold text-white">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="4" fill="#FF5F00"/>
                        <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" fill="#EB001B"/>
                        <path d="M9 5H15V19H9V5Z" fill="#F79E1B"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-white font-medium">Mastercard</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="pt-6 border-t border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">About payment methods</h2>
          <div className="text-gray-400 space-y-4">
            <p>
              You can use any of these saved payment methods to pay for a Spotify
              subscription or make other payments to Spotify.
            </p>
            <p>
              If you have an active subscription, you can change which payment method
              your subscription uses in your <a href="#" className="text-[#1ed760] hover:underline">subscription settings</a>.
            </p>
            <p>
              To delete a payment method, you must have at least one other payment method
              saved that can be used in your country of registration.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
