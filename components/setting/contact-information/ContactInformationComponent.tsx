"use client";

import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import { useModal } from "@/hooks/useModal";
import { useContactInformations } from "@/hooks/useContactInformations";
import { ContactInformation } from "@/types/ContactInformation";
import { EditContactInformationModal } from "./EditContactInformationModal";
import CoInformationButton from "./CoInformationButton";

const FieldIcon = ({ field }: { field: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    address: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    whatsapp: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21l1.3-4.1a9 9 0 1 1 3.8 3.8L3 21z"></path>
        <path d="M16.5 13.5c-.4-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.2-.7.1-.3-.2-1.4-.6-2.7-1.8-1-.9-1.7-2.2-2-2.6-.2-.3 0-.5.2-.7l.6-.7c.2-.2.2-.4.3-.6s0-.4 0-.6c-.1-.2-.7-1.8-.9-2.4-.2-.6-.5-.5-.7-.5H6c-.3 0-.7.1-1 .4-.3.3-1.2 1.1-1.2 2.8s1.3 3.3 1.5 3.6c.2.3 2.3 3.6 5.7 5.1 3.4 1.5 3.4 1 4 .9.6-.1 2-.9 2.2-1.8s.2-1.6.1-1.8c-.1-.2-.3-.3-.6-.5z"></path>
      </svg>
    ),
    latitude: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M12 6v12" /><path d="M12 6l4 6-4 6-4-6 4-6z" /><circle cx="12" cy="12" r="1" /></svg>,
    longitude: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M6 12h12" /><path d="M6 12l6-4 6 4-6 4-6-4z" /><circle cx="12" cy="12" r="1" /></svg>




  };
  return <div className="text-blue-500 dark:text-blue-400">{icons[field] || null}</div>;
};

// const InfoField = ({
//   label,
//   value,
//   fieldKey,
// }: {
//   label: string;
//   value?: string;
//   fieldKey: string;
// }) => (
//   <div className="flex items-start gap-4 rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900/80">
//     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-300">
//       <FieldIcon field={fieldKey} />
//     </div>
//     <div>
//       <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
//         {label}
//       </p>
//       <p className="text-base font-medium text-gray-900 dark:text-white/90 break-words">
//         {value || "-"}
//       </p>
//     </div>
//   </div>
// );
const InfoField = ({ label, value, fieldKey }: { label: string; value?: string; fieldKey: string }) => (
  <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-md">
    <div className="flex-shrink-0 w-8 h-8 mt-1">
      <FieldIcon field={fieldKey} />
    </div>
    <div className="flex-grow">
      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</h5>
      <p className="text-lg font-medium text-gray-900 dark:text-white/95 leading-relaxed break-words">{value || <span className="text-gray-400 dark:text-gray-500 italic">غير متوفر</span>}</p>
    </div>
  </div>
);
const EditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" /></svg>
);

const getAddress = (data: ContactInformation | undefined, locale: string) => {
  if (!data) return "";
  if (data.translated?.address) {
    return data.translated.address;
  }
  return data.translations?.[locale]?.address || "";
};

export default function ContactInformationComponent() {
  const { messages, locale } = useLocale();
  const { isOpen, openModal, closeModal } = useModal();
  const { contactInformation, loading, error, refetch } = useContactInformations(locale);

  const handleSave = () => {
    closeModal();
    refetch();
  };

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {messages["loading"] || "Loading..."}
      </p>
    );
  }

  if (error || !contactInformation) {
    return (
      <p className="text-red-500">
        {messages["no_data"] || "No data found."}
      </p>
    );
  }

  const cards = [
    {
      key: "phone",
      label: messages["phone"] || "Phone",
      value: contactInformation.phone,
    },
    {
      key: "whatsapp",
      label: messages["whatsapp"] || "WhatsApp",
      value: contactInformation.whatsapp,
    },
    {
      key: "email",
      label: messages["email"] || "Email",
      value: contactInformation.email,
    },
    {
      key: "address",
      label: messages["address"] || "Address",
      value: getAddress(contactInformation, locale),
    },
    {
      key: "latitude",
      label: messages["latitude"] || "Latitude",
      value:
        contactInformation.latitude !== undefined
          ? String(contactInformation.latitude)
          : undefined,
    },
    {
      key: "longitude",
      label: messages["longitude"] || "Longitude",
      value:
        contactInformation.longitude !== undefined
          ? String(contactInformation.longitude)
          : undefined,
    },
  ];

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {messages["contact_information"] || "Contact Information"}
      </h3>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white"></h4>
          <CoInformationButton
            size="sm"
            onClick={openModal}
          >
            <EditIcon />
            {messages["u_edit"] || "Edit"}
          </CoInformationButton>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card) => (
            <InfoField
              key={card.key}
              label={card.label}
              value={card.value}
              fieldKey={card.key}
            />
          ))}
        </div>
      </div>

      <EditContactInformationModal
        isOpen={isOpen}
        onClose={closeModal}
        handleSave={handleSave}
        data={contactInformation}
      />
    </>
  );
}
