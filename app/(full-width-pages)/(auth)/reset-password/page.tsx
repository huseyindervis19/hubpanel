import ResetPasswordComponent from "@/components/auth/ResetPasswordComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function ResetPasswordPage() {
  return <ResetPasswordComponent />;
}
