import { Metadata } from "next";
import AccountLayout from "@/components/account/AccountLayout";

export const metadata: Metadata = {
  title: "Account - Spotify",
  description: "Manage your Spotify account",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountLayout>{children}</AccountLayout>;
}
