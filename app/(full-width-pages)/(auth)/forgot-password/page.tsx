import ForgotPasswordComponent from "@/components/auth/ForgotPasswordComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function ResetPasswordPage() {
  return <ForgotPasswordComponent />;
}
