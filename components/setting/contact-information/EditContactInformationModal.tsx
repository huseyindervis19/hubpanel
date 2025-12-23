import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { ContactInformation } from "@/types/ContactInformation";
import { useLocale } from "@/context/LocaleContext";
import { useUpdateContactInfo } from "@/hooks/useContactInformations";
import Message from "@/components/ui/Message";

interface EditContactInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  data: ContactInformation;
}

export const EditContactInformationModal = ({
  isOpen,
  onClose,
  handleSave,
  data,
}: EditContactInformationModalProps) => {
  const { messages, locale } = useLocale();
  const { mutateAsync: update, isPending: updating } = useUpdateContactInfo();

  const [form, setForm] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  //
  // Load initial data
  //
  useEffect(() => {
    if (!data) return;

    setForm({
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      email: data.email || "",
      latitude: data.latitude != null ? String(data.latitude) : "",
      longitude: data.longitude != null ? String(data.longitude) : "",
      address: data.translated?.address || "",
    });
  }, [data, locale]);

  //
  // Handle form change
  //
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  //
  // Submit
  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      address: form.address.trim(),
    };

    try {
      const result = await update({
        id: data.id,
        data: payload,
        lang: locale,
      });

      if (result) {
        setMessage({
          text: messages["updated_successfully"] || "Updated successfully",
          type: "success",
        });

        setTimeout(() => {
          setMessage(null);
          handleSave();
          onClose();
        }, 1300);
      }
    } catch (err: any) {
      setMessage({
        text:
          err?.response?.data?.message ||
          messages["updated_error"] ||
          "An error occurred",
        type: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div
        className="no-scrollbar relative w-full max-w-[700px]
        overflow-y-auto rounded-3xl bg-white p-5
        dark:bg-gray-900 lg:p-10 shadow-xl transition-all duration-300"
      >
        {/* Header */}
        <h4 className="text-center mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {messages["edit_contact_info"] || "Edit Contact Information"}
        </h4>

        <p className="text-center mb-6 text-sm text-gray-500 dark:text-gray-400">
          {messages["edit_contact_info_desc"] ||
            "Update the displayed contact information."}
        </p>

        {/* Message */}
        <Message message={message} />

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label>{messages["phone"]}</Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={messages["phone_placeholder"] || "Enter phone number"}
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label>{messages["whatsapp"]}</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder={
                  messages["whatsapp_placeholder"] || "Enter WhatsApp number"
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>{messages["email"]}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={
                  messages["email_placeholder"] || "Enter email address"
                }
              />
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <Label>{messages["latitude"]}</Label>
              <Input
                type="number"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder={messages["latitude_placeholder"] || "21.4858"}
                step={0.0001}
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label>{messages["longitude"]}</Label>
              <Input
                type="number"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder={messages["longitude_placeholder"] || "39.1925"}
                step={0.0001}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>{messages["address"]}</Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder={
                  messages["address_placeholder"] || "Enter address"
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-5 justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              {messages["cancel"] || "Cancel"}
            </Button>

            <Button size="sm" type="submit" disabled={updating}>
              {updating
                ? messages["updating"] || "Updating..."
                : messages["update"] || "Update"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
