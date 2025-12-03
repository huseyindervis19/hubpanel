"use client";

import { useLocale } from "@/context/LocaleContext";
import { useModal } from "@/hooks/useModal";
import { useContactInfo } from "@/hooks/useContactInformations"; // ← النسخة الجديدة الصحيحة

import { EditContactInformationModal } from "./EditContactInformationModal";

import {
  PencilIcon,
  AddressIcon,
  WhatsappIcon,
  MailIcon,
  PhoneIcon,
  
} from "@/icons";

//
// Icon Mapping
//
const ICONS: Record<string, React.ReactNode> = {
  phone: <PhoneIcon />,
  email: <MailIcon />,
  address: <AddressIcon />,
  whatsapp: <WhatsappIcon />,
  latitude: <AddressIcon />,
  longitude: <AddressIcon />,
};

//
// Field Icon Component
//
const FieldIcon = ({ field }: { field: string }) => (
  <div
    className="w-9 h-9 flex items-center justify-center rounded-lg
               bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400
               shadow-sm"
  >
    {ICONS[field] || null}
  </div>
);

//
// Single Info Field Component
//
const InfoField = ({
  label,
  value,
  fieldKey,
}: {
  label: string;
  value?: string;
  fieldKey: string;
}) => (
  <div
    className="flex items-start gap-4 p-4 rounded-xl border 
               bg-white/70 dark:bg-white/[0.05]
               border-gray-200 dark:border-gray-800
               shadow-sm hover:shadow-md transition duration-200"
  >
    <FieldIcon field={fieldKey} />

    <div className="flex flex-col">
      <span
        className="text-xs font-semibold uppercase tracking-wide
                   text-gray-500 dark:text-gray-400"
      >
        {label}
      </span>

      {value ? (
        <p className="text-lg font-medium text-gray-900 dark:text-white/95 break-words">
          {value}
        </p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic">غير متوفر</p>
      )}
    </div>
  </div>
);

//
// Main Component
//
export default function ContactInformationComponent() {
  const { messages, locale } = useLocale();
  const { isOpen, openModal, closeModal } = useModal();

  //
  // استخدام الــ hook الجديدة
  //
  const {
    data: contactInformation,
    isLoading: loading,
    error,
    refetch,
  } = useContactInfo(locale);

  const handleSave = () => {
    closeModal();
    refetch();
  };

  //
  // Loading State
  //
  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">
        {messages["loading"] || "Loading..."}
      </p>
    );
  }

  //
  // Error or No Data
  //
  if (error || !contactInformation) {
    return (
      <p className="text-red-500 text-sm">
        {messages["no_data"] || "No data found."}
      </p>
    );
  }

  //
  // Fields List
  //
  const fields = [
    {
      key: "phone",
      label: messages["phone"],
      value: contactInformation.phone,
    },
    {
      key: "whatsapp",
      label: messages["whatsapp"],
      value: contactInformation.whatsapp,
    },
    {
      key: "email",
      label: messages["email"],
      value: contactInformation.email,
    },
    {
      key: "address",
      label: messages["address"],
      value: contactInformation.translated?.address, // ← عرض الترجمة فقط
    },
    {
      key: "latitude",
      label: messages["latitude"],
      value:
        contactInformation.latitude !== undefined
          ? String(contactInformation.latitude)
          : undefined,
    },
    {
      key: "longitude",
      label: messages["longitude"],
      value:
        contactInformation.longitude !== undefined
          ? String(contactInformation.longitude)
          : undefined,
    },
  ];

  return (
    <>
      <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {messages["contact_information"] || "Contact Information"}
      </h3>

      <div
        className="rounded-2xl border bg-white p-6 shadow-lg 
                   border-gray-200 dark:border-gray-800 
                   dark:bg-white/[0.03] space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white"></h4>

          <button
            className="flex items-center gap-2 rounded-full border 
                       border-gray-300 bg-white px-4 py-3 text-sm font-medium
                       text-gray-700 shadow-theme-xs hover:bg-gray-50 
                       dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
                       dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={openModal}
          >
            <PencilIcon />
            {messages["edit"] || "Edit"}
          </button>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => (
            <InfoField key={f.key} label={f.label} value={f.value} fieldKey={f.key} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <EditContactInformationModal
        isOpen={isOpen}
        onClose={closeModal}
        handleSave={handleSave}
        data={contactInformation}
      />
    </>
  );
}
