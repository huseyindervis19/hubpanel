"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useForgotPassword } from "@/hooks/useAuth";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import LanguageSwitcher from "@/components/header/LanguageSwitcher";

const ForgotPasswordComponent = () => {
  const { messages } = useLocale();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          setSuccessMessage(
            messages["send_password_success"] ||
            "Password reset link sent! Check your email."
          );
        },
        onError: (err: any) => {
          const frontMessage = messages["user_not_found"];
          const apiMessage = err?.response?.data?.message;
          setErrorMessage(frontMessage || apiMessage);
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {messages["forgot_password"] || "Forgot Password"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {messages["forgot_password_description"] ||
              "Enter your email to receive a password reset link."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>
              {messages["signin_email"] || "Email"}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder={messages["signin_email_placeholder"] || "info@gmail.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Button className="w-full" size="sm" type="submit" disabled={isPending}>
              {isPending
                ? messages["loading"] || "Loading..."
                : messages["reset_password_button"] || "Send Reset Link"}
            </Button>

            {errorMessage && (
              <p className="mt-2 text-md text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="mt-2 text-md text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            )}
          </div>
        </form>

        <div className="mt-4">
          <Link
            href="/signin"
            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            {messages["back_to_signin"] || "Back to Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
