"use client";

import { useLocale } from "@/context/LocaleContext";

const ResetPasswordComponent = () => {
  const { messages } = useLocale();
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {messages["reset_password"] || "ResetPasswordComponent"}
    </div>
  );
}
export default ResetPasswordComponent;