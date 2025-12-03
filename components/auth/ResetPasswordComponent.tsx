"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useResetPassword } from "@/hooks/useAuth";
import LanguageSwitcher from "@/components/header/LanguageSwitcher";
import { EyeIcon, EyeCloseIcon } from "@/icons";

const ResetPasswordComponent = () => {
  const { messages, locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const isRtl = locale === "ar";

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!token) return setErrorMessage("Invalid or missing token");
    if (newPassword !== confirmPassword) return setErrorMessage("Passwords do not match");

    resetPassword(
      { token, newPassword },
      {
        onSuccess: (data) => {
          setSuccessMessage(messages["reset_password_success"] || data.message);
          setTimeout(() => router.push("/signin"), 2000);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || "Failed to reset password";
          setErrorMessage(msg);
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
            {messages["reset_password"] || "Reset Password"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {messages["reset_password_description"] || "Enter your new password below."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Label>{messages["new_password"] || "New Password"}:</Label>

            <Input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-9 ${isRtl ? "left-4" : "right-4"} z-10`}
              aria-label={
                showPassword
                  ? (messages["hide_password"] || "Hide password")
                  : (messages["show_password"] || "Show password")
              }
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>

          <div className="relative">
            <Label>{messages["confirm_password"] || "Confirm Password"}:</Label>

            <Input
              type={showCPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowCPassword(!showCPassword)}
              className={`absolute top-9 ${isRtl ? "left-4" : "right-4"} z-10`}
              aria-label={
                showCPassword
                  ? (messages["hide_password"] || "Hide password")
                  : (messages["show_password"] || "Show password")
              }
            >
              {showCPassword ? (
                <EyeIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="w-5 h-5 fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
          <div>
            <Button className="w-full" size="sm" type="submit" disabled={isPending}>
              {isPending ? messages["loading"] || "Loading..." : messages["reset_password"] || "Reset Password"}
            </Button>
            {errorMessage && (
              <p className="mt-2 text-md text-red-600 dark:text-red-400">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="mt-2 text-md text-green-600 dark:text-green-400">{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
