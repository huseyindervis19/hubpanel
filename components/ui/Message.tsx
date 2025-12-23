import React from "react";

export type MessageType = "success" | "error";

interface MessageProps {
  message: { text: string; type: MessageType } | null;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message) return null;

  const baseStyles = "p-4 rounded-xl border mb-4 text-center font-medium transition-opacity duration-300";
  const typeStyles =
    message.type === "success"
      ? "border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20"
      : "border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20";

  return <div className={`${baseStyles} ${typeStyles}`}>{message.text}</div>;
};

export default Message;
